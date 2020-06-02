const express = require('express')
const User = require('../models/user')
const route = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelationEMail} = require('../emails/account')

//create user
route.post('/api.users', async (req, res) => {  
    const user = new User( req.body)
    try{    
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()   
        res.status(201).send({ user, token})
    }
    catch(error){
        res.status(406).send(error)
    }    
})
//user login
route.post('/api.users/login', async (req,res) => {
    try{
            const user = await User.findByCredentials( req.body.email , req.body.password)
            const token = await user.generateAuthToken()
            res.send({ user, token})
       }catch(error){
            res.status(400).send() 
    }
})
//logout user
route.post('/api.users/logout', auth , async (req, res) => {
    try{
            req.user.tokens = req.user.tokens.filter(( token) => {
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
    }catch(error){
        console.log(error)
        res.status(500).send()
    }
})
//logout All

route.post('/api.users/logoutall', auth, async ( req, res) =>{
    try{
        req.user.tokens= []
        await req.user.save()
        res.send('Successfully logged out from all logins ')
    }   
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
} )

//Read Users
route.get('/api.users/me', auth, async ( req, res) => {
        res.send(req.user)
})

//Update a user 
route.patch('/api.users/me',auth,async (req,res)=>{
    const updates=Object.keys( req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'invalid updates..'})
    }
    try{
            updates.forEach((update) => {req.user[update]=req.body[update]
            })
            await req.user.save()
            res.status(200).send( req.user)
    }
    catch(e){
                res.status(400).send(e)
    }

})
//Set profile Picture
const upload = multer({
    limits:{
        fileSize: 2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }

})
route.post('/api.users/me/avatar', auth , upload.single('avatar'),async ( req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}),(error, req, res,next) => {
    console.log(error)
    res.status(400).send({error:error.message})
}
//Delete Profile Picture
route.delete('/api.users/me/avatar', auth ,async ( req, res) => {
    req.user.avatar= undefined
    await req.user.save()
    res.send()
}),(error, req, res,next) => {
    console.log(error)
    res.status(401).send({error:error.message})
}
//Fetching an avatar
route.get('/api.users/:id/avatar', async ( req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
})
//Delete User
route.delete('/api.users/me', auth , async ( req, res) => {
    try{
            await req.user.remove()
            sendCancelationEMail(req.user.email, req.user.name)
            res.status(200).send(req.user)
        }catch(error){
            res.status(401).send(error)
    }
})

module.exports = route