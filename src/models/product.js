const mongoose=require('mongoose')
const UserAdmin = require('../models/adminUser') 
const productSchema = new mongoose.Schema({
    _id:{
        type:Number 
    },
    name:{
        type:String,
        required: true,
        trim:true 
    },
    category:{
        type: String,
        required:true,
        trim:true
    }, 
    price:{
        type: Number,
        default:0,
        validate(value){
            if(value < 0){
                throw new Error('Price of the product cannot be zero or negative..')
            }
        }   
    },
    instock:{
        type: Boolean,
        default:false
    },
    stock:{
        type:Number,
        default:0,
        validate(value){
            if(value < 0 ){
                throw new Error('Quantity stored of a product cannot be negative..')
            }
        }
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin'           
    }
    
 
})
const Product = mongoose.model('product',productSchema)
module.exports = Product