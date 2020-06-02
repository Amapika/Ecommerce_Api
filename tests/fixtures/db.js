const mongoose = require('mongoose')
    const jwt = require('jsonwebtoken')
    const User = require('../../src/models/user')
    const {Cart}= require('../../src/models/cart')
    const UserAdmin = require('../../src/models/adminUser')                        
    const Product = require('../../src/models/product')
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Tiger',
    email: 'tiger07@test.com',
    password: '56tiger1!!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}
const userAdminId = new mongoose.Types.ObjectId()
const userAdmin = {
    _id: userAdminId,
    name: 'TestAdmin',
    email: 'testAdmin@test.com',
    password: 'testAdmin!!',
    tokens: [{
        token: jwt.sign({ _id: userAdminId }, process.env.JWT_SECRET)
    }]
}

const cart1= {
    products:[{
        _id:"item1",
        productid:1,
        quantity:1
    }],
    owner: userOne._id 
}

const cart2= {
    products:[{
        _id:"item2",
        productid:2,
        quantity:10
    }],
    owner: userTwo._id 
}
 
const product1={
    _id:1,	
    name:'Laptop',
    category:'electronics',
    price:'20000',
    instock:true,
    stock:50
}

const product2={
    _id:2,	
    name:'Iphone',
    category:'electronics',
    price:'40000',
    instock:false,
}


const setupDatabase = async () => {
   try{
    await User.deleteMany()
    await Cart.deleteMany()
    await UserAdmin.deleteMany()
    await Product.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new UserAdmin(userAdmin).save()
   // await new Cart(cart1).save()
    await new Cart(cart2).save()
    await new Product(product1).save()
    await new Product(product2).save()
}catch(err){
       console.log(err)
   }
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    userAdminId,
    userAdmin,
    product1,
    product2,
    cart1,
    cart2,
    setupDatabase
}