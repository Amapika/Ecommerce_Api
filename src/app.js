const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Product = require('./models/product')

const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const adminRouter = require('./routers/adminuser')
const cartRouter = require('./routers/carts')
const auth = require('./middleware/auth')
const adminauth= require('./middleware/adminauth')


const app = express()

// for automatically parsing incoming json to object so we can access it in our handlers 
app.use(express.json())
app.use(userRouter)
app.use(productRouter)
app.use(adminRouter)
app.use(cartRouter)



module.exports= app