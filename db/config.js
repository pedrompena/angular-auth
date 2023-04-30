const mongoose = require('mongoose')

const dbConecction = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('DB Online')
  } catch (error) {
    console.log(error)
    throw new Error('Error initializing database')
  }
}

module.exports = { dbConecction }
