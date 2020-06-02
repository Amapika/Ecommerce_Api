const mongoose=require('mongoose')
const User = require('../models/user')
const validator = require('validator')
const Product = require('../models/product')
const cartSchema = new mongoose.Schema({  
    products: [{
        _id: String,
        productid: {
            type: Number,
            required:true,
            ref: 'Product' 
        },
        quantity:{
            type:Number
        }
    }],
     owner:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref: 'User'           
        },
        Checkout:{
            type:Boolean,
            default:false
        }
},{
    timestamps:true
})
const Cart = mongoose.model('Cart',cartSchema)
module.exports ={
    Cart,
    cartSchema
}


