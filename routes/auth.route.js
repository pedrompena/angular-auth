const { Router } = require('express')
const {
  createUser,
  loginUser,
  revalidateToken,
} = require('../controllers/auth.controller')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validate-fields')
const { validateJwt } = require('../middlewares/validate-jwt')

const router = Router()

// Create new user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().isLength({ min: 3 }),
    check('email', 'Please include a valid email').not().isEmpty().isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
      .isLength({ min: 6 }),
    validateFields,
  ],
  createUser
)

// Login user
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 }),
    validateFields,
  ],
  loginUser
)

// Revalidate token
router.get('/', [validateJwt], revalidateToken)

module.exports = router
