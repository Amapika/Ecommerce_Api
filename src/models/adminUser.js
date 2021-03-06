const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Product = require('./product')

const userAdminSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('It is an invalid Email Id')
            }
        }
    },  
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age : {
        type: Number,
        validate(value) {
            if(value < 0){
                throw new Error(' Age must be a positive number')
                
            }
        }
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps:true 
})

userAdminSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField : 'owner'
})

userAdminSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userAdminSchema.methods.generateAuthToken = async function () {
    const user = this 
    const token = jwt.sign({ _id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await  user.save()
    return token 
}

userAdminSchema.statics.findByCredentials = async (email ,password) =>{
    const user = await UserAdmin.findOne({email})

    if(!user){
        throw new Error('Unable to Login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return  user
}

//Hash the plain text password
userAdminSchema.pre('save', async function(next){
    const user = this 
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const UserAdmin = mongoose.model('UserAdmin',userAdminSchema)

module.exports = UserAdmin

