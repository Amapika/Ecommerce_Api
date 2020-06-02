const express = require('express')
const Product = require('../models/product')
const route = new express.Router()
const adminauth = require('../middleware/adminauth')

//create Products
route.post('/api.products', adminauth ,async ( req, res) => {
    console.log(req.body)
    const products = new Product(req.body)
    try{
        await products.save() 
        res.status(201).send(products)  
    }catch(error){
        console.log(error)
        res.status(406).send()
    }
})


//Get All Products
route.get('/api.products', async ( req, res) => {
    try{
        const products = await Product.find({}) 
        res.status(200).send(products) 
    }catch(error){
        res.status(500).send()
    }
 })
 
//Read a Particular Product
route.get('/api.products/:id', async ( req, res) => {
    const _id = req.params.id
    try{
        const products = await Product.findById(_id)
        if(!products){
            return res.status(404).send()
        }
        res.status(200).send(products)
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})
 
//Update Product 
route.patch('/api.products/:id',adminauth,async ( req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'category' , 'price' , 'instock','stock']    
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'invalid update.'})
    }
    try{
        const product = await Product.findById(req.params.id)

        updates.forEach((update) => product[update] = req.body[update])

        await product.save()

        if(!product){
                return res.status(404).send()
            }
          res.status(200).send(product)
        }catch(error){
            console.log(error)
    res.status(401).send(error)
    }
})

//Delete Product
route.delete('/api.products/:id',adminauth,async ( req, res) => {
    try{
            const products = await Product.findByIdAndDelete(req.params.id)
            if(!products){
                return res.status(404).send()
            }
            res.status(200).send(products)
    }catch(error){
       
        res.status(500).send(error)
    }
})

module.exports = route