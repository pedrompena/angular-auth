const { response, request } = require('express')
const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const { jwtGenerator } = require('../helpers/jwt')

const createUser = async (req = request, res = response) => {
  const { name, email, password } = req.body

  try {
    // Duplicate verification
    const user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'Email already exists',
      })
    }
    // Create user
    const dbUser = new User(req.body)

    // Encrypt password
    const salt = bcryptjs.genSaltSync()
    dbUser.password = bcryptjs.hashSync(password, salt)

    // Generate jwt
    const token = await jwtGenerator(dbUser.id, name, email)

    // Create user in DB
    await dbUser.save()

    // Generate response
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    })
  }
}

const loginUser = async (req = request, res = response) => {
  const { email, password } = req.body

  try {
    const dbUser = await User.findOne({ email })
    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: 'Email is incorrect',
      })
    }

    const validPassword = bcryptjs.compareSync(password, dbUser.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Password is incorrect',
      })
    }

    const token = await jwtGenerator(dbUser.id, dbUser.name, dbUser.email)

    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token,
    })
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Please contact the administrator',
    })
  }
}

const revalidateToken = async (req = request, res = response) => {
  const { uid, name, email } = req

  const token = await jwtGenerator(uid, name, email)

  return res.json({
    ok: true,
    uid,
    name,
    token,
    email
  })
}

module.exports = { createUser, loginUser, revalidateToken }
