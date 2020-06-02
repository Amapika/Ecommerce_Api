const express = require('express')
const {Cart} = require('../models/cart')
const route = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

//create cart 
route.post('/api.carts', auth , async ( req, res) => {
    const temp = await Cart.findOne({ owner : req.user._id})    
    if(temp){
        return res.status(404).send("Owner can have only one cart!")
    }
    const cart = new Cart({ ...req.body , owner:req.user._id})
    try{
        await cart.save()
        res.status(201).send(cart)
    }
    catch(error){
           console.log(error)
           res.status(406).send(error)
    }
})
//read cart information 
route.get('/api.carts',auth, async ( req, res) => {
    try{
        const cart = await Cart.find({owner: req.user._id})    
        // await req.user.populate('carts').execPopulate()
         //res.status(200).send(req.user.carts)
            res.status(200).send(cart)
        } catch( error){
        res.status(500).send()
    }   
})
//Add new Products to existing cart
route.post('/api.carts/:id', auth , async( req, res) => {
    try{
            const pro = {...req.body}
            const cart = await Cart.findOneAndUpdate({_id:req.params.id, owner: req.user._id},{$push:{
                products:{
                    "_id":req.body._id,
                    "productid":req.body.productid,
                    "quantity":req.body.quantity
                }
            }})
            if(!cart){
            return res.status(404).send()
            }
            await cart.save()
            await req.user.populate('carts').execPopulate()
            res.status(200).send(req.user.carts)
            
        }
    catch(error){
        res.status(400).send()
        }
})
//Edit Cart 
route.patch('/api.carts/:id', auth , async ( req, res) => {
    try{
        const cart = await Cart.findOneAndUpdate({ _id:req.params.id, owner:req.user._id },{
             $pull:{
                     products:{ _id: req.body}      
                 }
            })
        if(!cart){
              res.status(404).send()
            }
        await cart.save()
        res.status(200).send(cart)    
    }catch(error){
       res.status(400).send()
    }
})
//Empty Cart 
route.delete('/api.carts/:id', auth ,async ( req, res) => {
    try{
       // const cart = await Cart.findByIdAndDelete(id)
        const cart = await Cart.findOneAndDelete({_id :req.params.id, owner: req.user._id})   
        console.log(cart)
        if(!cart){
                return res.status(404).send()
            }
            res.status(200).send(cart)
    }catch(error){
        res.status(401).send(error)
    }
})
//checkout
route.post('/api.carts/checkout/:id',auth, async ( req, res)=>{
    try{
             await Cart.findOneAndUpdate({_id:req.params.id,owner:req.user._id},{
                new:true,
                Checkout:true
              
            })
            const cart = await Cart.findOne({owner:req.user._id})
            const user = await User.findOne({_id:req.user._id}) 
            var items=[];
            var quantity=[];
            for(item=0;item<cart.products.length;item++){
                console.log(cart.products[item]);
                items.push({
                    items:cart.products[item]
                });
            }            
            if(cart && cart.Checkout == true){
               const success =await User.findOneAndUpdate({_id:req.user._id},{
                  new:true,
                   $push:{
                    Orders:{ 
                        $each:[
                                {
                                    OrderDate:cart.updatedAt, 
                                    TotalItems:[
                                                    {
                                                        Products:[{     
                                                                    Item:[items]
                                                            
                                                                //  _id:cart.products[0]._id,
                                                                //  "productid":cart.products[0].productid,
                                                                //  "quantity":cart.products[0].quantity
                                                                }],
                                                        owner:req.user._id
                                                    }
                                                ]
                                }
                            ]

                        }       
                    }
                })
                if(!success){
                    throw new Error()
                }
                await success.save()
                await Cart.findOneAndDelete({_id:req.params.id,owner:req.user._id})
                return res.status(200).send(success)
                                
            }    
        
        }
catch(error){
        console.log(error)
        res.status(400).send()
    }
})

module.exports = route

