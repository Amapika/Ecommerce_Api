# Ecommerce website project description

This project is using the following technology stack:

  - Node.js Runtime Environment
  - Express framework (web framework for Node.js)
  - MongoDB database (document based)

-Ecommerce-Api that allows consumers to shop for various products. Products are sepearted by categories which allows for smoother functionality and design. 
Consumers are allowed to add, update, edit, and delete products in their carts,along with the extra features like setting up their own Avatar(Profile Pictures). 
Consumers can checkout their products which entry would be stored and depending upon payment process further things would be added up in enhancement.
Admins have the power to update, delete, edit, and add products to the store.
This project resembles  with full features such as user authentication and authorization,search and Welcome email and goodbye email features. 
### Version
1.0
---
## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm
      $ npm i nodemon
- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0
    
   $ npm i nodemon --save-dev
 
If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install  

As Our API is server side so for sending request download postman 
   Just go on [official Postman.com website](https://www.postman.com ) and download the installer.

 ## Configure app

Npm is the node package manager and you will need to install the following modules using it:                    
Open `package.json` then edit it with your settings. You will need:
   ```
        {
        "name": "ecommerce",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {
            "start": "node src/index.js",
            "dev": "env-cmd -f ./config/dev.env nodemon src/index.js",
            "test": "env-cmd -f ./config/test.env jest --watchAll --runInBand"
        },
        "jest": {
            "testEnvironment": "node"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
            "@sendgrid/mail": "^6.3.1",
            "bcryptjs": "^2.4.3",
            "express": "^4.17.1",
            "jsonwebtoken": "^8.5.1",
            "mongoose": "^5.9.14",
            "multer": "^1.4.2",
            "sharp": "^0.25.3",
            "supertest": "^4.0.2",
            "validator": "^13.0.0"
        },
        "devDependencies": {
            "env-cmd": "^10.0.1",
            "jest": "^26.0.1",
            "nodemon": "^2.0.4"
        }
        }
```
- run   npm install ;

This command will install all the dependencies from the file **package.json**.

A **package.json** file contains meta data about your app or module. Most importantly, it includes the list of dependencies to install from npm when running npm install . If you're familiar with Ruby, it's similar to a Gemfile.

## Running the project

From the ecommerce folder open the cmd and run the following to get server started.

- to start the app run : npm run dev
- to test the app run : npm run test

For client side set follow the below steps and send requests from postman

###1
After installation we would just walk through the schemas and there requirements,So it would easy to go ahead.   
    Models :
            1. User
            2. Product
            3. Cart
            4. Admin

## User Authentication and Authorization 

For user authentication we have used *jsonwebtoken* library with the aim of tokenizing amd logging the user requests to the webserver (e.g. access to different routes).
For the User Schema we use mongoose, which is an *Object Relational Mapper*, which is like a virtual object database, that can be used within Node itself. 
Basically it connects our Node.js project with MongoDB database, without the need to implicitly connect them using additional code.

The User Schema is defined as follows:
const userSchema = new mongoose.Schema({
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
    },
    Orders:
			[{
        OrderDate:{
                    type:Date
                },
        Payment_Processed:{
                    type:Boolean,
                    default:false
        
                },
        TotalItems:[  
                    {  
                        Products:[]
                    }
                                                                 
                 ]
                                
			}]	         
},{
    timestamps:true 
})

From the Schema we can derive that the User entity is described by 7 characteristics:
1. name 
2. email
3. password
4. age
5. avatar
6. tokens
7. orders

* There are three sections in this file:
 1. Tokenization using jsonwebtoken  user objects
 2. Middleware that will process the login mechanism
 3. Custom function to validate if a user is logged in or not

**Tokenization** is the process of generating web token with a secret key into multiple rounds,
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. 
This information can be verified and trusted because it is digitally signed. 
JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.

Although JWTs can be encrypted to also provide secrecy between parties, we will focus on signed tokens. 
Signed tokens can verify the integrity of the claims contained within it,while encrypted tokens hide those claims from other parties. 
When tokens are signed using public/private key pairs,the signature also certifies that only the party holding the private key is the one that signed it.
 We want to translate the data structure, which is the ```user``` object and we want to translate it into a format that can be stored. 
 Thus, we will store it in connect-mongo. So, the key of this object is provided into the 2nd argument of the callback function in ```generateAuthToken```, which is ```user._id```.
 generateAuthToken function will be saved into Token and it is used to retrieve the whole object via  function call.



#### In ```routers/user.js``` we added 10 routes:
```
1.Creating User :

                    route.get('/api.users')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users      ----url either localhost or env variable 
                        
                        {
                        "name":"Aman Agarwal",
                        "email":"amangarwal07@gmail.com",              ----body                     
                        "password":"alexa07"
                        }                            
    --- THIS IS FOR TESTING CURRENTLY JUST REMEMBER THE SETTING WE ARE CONFIGURING HERE FURTHER WOULD BE EXPLAINED THOROUGHLY
                     
                     if (pm.response.code == 201) {
                            
                            pm.environment.set('authToken', pm.response.json().token)            ----tests
                            
                            }   

2.Login User : 
                    route.post('/api.users/login')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/login     ----url either localhost or env variable 
                        
                    {
                    "email":"amangarwal07@gmail.com",   -----body
                    "password":"alexa07"    
                     }                   
    
                    if (pm.response.code == 200) {
                       pm.environment.set('authToken', pm.response.json().token)    ----tests
                    }   


3.Read Profile : This is used to get the user profile 

                    route.post('/api.users/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/me     ----url either localhost or env variable             


4.Update Profile : This is used to update the user profile (can update name,email, password,age,avatar)

                    route.patch('/api.users/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/me     ----url either localhost or env variable             
                    {
                        "name":"Ruchira",
                        "email":"ruchira@gmail.com",
                        "password":"ruchira@123",    
	                    "age":"45"
                    }


5.Upload avatar: Here we have to upload the picture which should be either jpeg,jpg or png format 
                    route.post('/api.users/me/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/me/avatar     ----url either localhost or env variable             

                    Here we have to upload the picture by going into Body and the 
                    form data,Up there selecting the upload format as file providing the following values:
                        KEY- avatar
                        value- anyimage.jpg
                

6.View avatar: 
                    route.get('/api.users/:id/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/5ec7e0ed3dd61a32944803c9/avatar     ----url either localhost or env variable (should provide the id of which we want to see the profile picture)  

7.Delete avatar: 
                    route.delete('/api.users/me/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/me/avatar     ----url either localhost or env variable

8.Logout User:
                    route.post('/api.users/logout')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/logout     ----url either localhost or env variable

9.Logout User From Everywhere:

                    route.post('/api.users/logoutAll')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/logoutAll     ----url either localhost or env variable
10.Delete User :
                    
                    route.delete('/api.users/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.users/me     ----url either localhost or env variable

Each collection contains relevant documents, for instance ```carts``` collection contains cart for each of the registered user. The document schema of ```cart``` model is defined below:
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

```
#### In ```routers/cart.js``` we added 6 routes:
```
As we all know A single user can have only one cart which is authorized so we first consider the cart schema up here rather moving towards the products  
1.create cart :  
                    route.post('/api.carts')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.carts     ----url either localhost or env variable

                    {
                        "products":[{
                            "_id":"item2",
                            "productid":23,
                            "quantity":44
                        },{                       ------body
                            "_id":"item3",
                            "productid":13,
                            "quantity":44
                        }]
                    }

2.read cart: 
                
                    route.get('/api.carts?sortBy=updatedAt:asc')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.carts?sortBy=updatedAt:asc     ----url either localhost or env variable

3.Add product the existing cart:
                    route.post('/api.carts/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.carts/5ec7e17f3dd61a32944803cc    ----url either localhost or env variable(should provide the id of cart)  
                        {

                                "_id":"item5",
                                "productid":3,      --body
                                "quantity":3
                        }
4.Edit Cart (remove product):
                    route.patch('/api.carts/5ec7e17f3dd61a32944803cc')        ----server side  

                    At client side user should request the server in following way :-
                    localhost:3000/api.carts/:id    ----url either localhost or env variable(should provide the id of cart)  
                        { 
                        "_id": "item5"               -----body
                        }
5.Empty Cart :  
                    route.delete('/api.carts/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.carts/5ec7e17f3dd61a32944803cc    ----url either localhost or env variable(should provide the id of cart) 

6.checkout: 
                    route.post('/api.carts/checkout/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.carts/checkout/5ec7e17f3dd61a32944803cc    ----url either localhost or env variable(should provide the id of cart) 


* We are using the middleware we created, namely ```auth and adminauth``` for authorization and then we pass in every request through this middleware, successRedirect to profile url, or if failure, than need to login through correct credentials
through login url

The user object will get available for all the routes except creation deletion or update operation of product or any other user.

* This is instead of specifying manually (redundantly) in every needed route, an user object, like ```user: req.user```
* Every route will have the user object by default with the help of jsonwebtoken 

* But for that One main things is to be done through postman app:
    - For all routes to be worked accordingly with out any authorization error we need to set up this jsonwebtoken which going to be generated for  
      every user and we need to set them up in parent Bearer token which is authorization like 

          Where All of this request would be stored, don't forget to edit that folder and move into Authorization section and 
        set the type as Bearer and Token as {{authToken}}
                      
                      1. Creating user for first time and setting up his token so that he can get access to all routes with authorization    
                          if (pm.response.code == 201) {
                            
                            pm.environment.set('authToken', pm.response.json().token)            ----tests
                            
                            }   
                       2. Login 
                           if (pm.response.code == 200) {
                           pm.environment.set('authToken', pm.response.json().token)    ----tests
                           }  
                           
* After Setting up Postman in above way just do not forget to inherit all routes from parent so they would get this token or otherwise it would
    be considered as unauthenticated.

* The user object ```obj``` is based on the result of the new user creation which we created here: ```User.findOne({email: req.body,email…```

* The user as a saved object, is then passed to the login function, so the user will have the token on the Postman and the token on the serve
       
 
   ## Products and Admin functionality
---

#### Product and Admin models

* The product model:
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

#### In ```routers/product.js``` we added 5 routes:
```
 A Product can be created,updated and deleted by Admin only .

* A different local authorization is to be created for create update and delete product so that it crud operation over them would be performed by
    authorized admin 
                     1. In postman ,Creating Admin  for first time and setting up his token so that he can get access to all products and admin routes with authorization    
                          if (pm.response.code == 201) {
                            
                            pm.environment.set('authTokennn', pm.response.json().token)            ----tests
                            
                            }   
                       2. In postman, while Login :
                           if (pm.response.code == 200) {
                           pm.environment.set('authTokennn', pm.response.json().token)    ----tests
                           }  
 * Go manually in postman and through create,update and delete routes of products set Authorization type as 
 Bearer and token as {{authTokennn}}    
    
1.create product :  
                    route.post('/api.products')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.products     ----url either localhost or env variable

                        {
                            "_id":1,	
                            "name":"Laptop",
                            "category":"electronics",         -----body
                            "price":20000,
                            "instock":true,
                            "stock":50
                        }
       
 2.get Products:
                    route.post('/api.products')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.products     ----url either localhost or env variable
3.get single product: 
                    route.post('/api.products/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.products/1     ----url either localhost or env variable(1 is id of the product)

4.Update Product:
                   route.patch('/api.products/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.products/1     ----url either localhost or env variable(1 is id of the product)
                            {
                                
                                "name":"aata",
                                "category":"grocery",          ---body
                                "price":300,
                                "instock":true
                            }
5.Delete Product:
                   route.delete('/api.products/:id')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.products/1     ----url either localhost or env variable(1 is id of product )


* The admin model:

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
#### In ```routers/user.js``` we added 10 routes:
```
1.Creating User :

                    route.get('/api.usersAdmin')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin      ----url either localhost or env variable 
                        
                        {
                        "name":"userAdmin",
                        "email":"adminsUser@gmail.com",              ----body                     
                        "password":"adminsecret()!"
                        }                            
    --- THIS IS FOR TESTING CURRENTLY JUST REMEMBER THE SETTING WE ARE CONFIGURING HERE FURTHER WOULD BE EXPLAINED THOROUGHLY
                     
                     if (pm.response.code == 201) {
                            
                            pm.environment.set('authToken', pm.response.json().token)            ----tests
                            
                            }   

2.Login User : 
                    route.post('/api.usersAdmin/login')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/login     ----url either localhost or env variable 
                        
                    {
                            "email":"adminsUser@gmail.com",              ----body                     
                             "password":"adminsecret()!"
                     }                   
    
                    if (pm.response.code == 200) {
                       pm.environment.set('authToken', pm.response.json().token)    ----tests
                    }   


3.Read Profile : This is used to get the user profile 

                    route.post('/api.usersAdmin/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/me     ----url either localhost or env variable             


4.Update Profile : This is used to update the user profile (can update name,email, password,age,avatar)

                    route.patch('/api.usersAdmin/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/me     ----url either localhost or env variable             
                    {
                        "name":"Aman",
                        "email":"Aman09@gmail.com",
                        "password":"Amsd@123",    
	                    "age":"45"
                    }


5.Upload avatar: Here we have to upload the picture which should be either jpeg,jpg or png format 
                    route.post('/api.usersAdmin/me/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/me/avatar     ----url either localhost or env variable             

                    Here we have to upload the picture by going into Body and the 
                    form data,Up there selecting the upload format as file providing the following values:
                        KEY- profilepicture
                        value- anyimage.jpg
                

6.View avatar: 
                    route.get('/api.usersAdmin/:id/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/5ec7e0ed3dd61a32944803c9/avatar     ----url either localhost or env variable (should provide the id of which we want to see the profile picture)  

7.Delete avatar: 
                    route.delete('/api.usersAdmin/me/avatar')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/me/avatar     ----url either localhost or env variable

8.Logout User:
                    route.post('/api.usersAdmin/logout')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/logout     ----url either localhost or env variable

9.Logout User From Everywhere:

                    route.post('/api.usersAdmin/logoutAll')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/logoutAll     ----url either localhost or env variable
10.Delete User :
                    
                    route.delete('/api.usersAdmin/me')        ----server side  

                    At client side user should request the server in following way :-

                    localhost:3000/api.usersAdmin/me     ----url either localhost or env variable

#This are the routes through which the API would be able to execute on client and server side.
