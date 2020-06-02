const request = require('supertest')
const app = require('../src/app')
const {Cart}= require('../src/models/cart')
const { 
    userOneId, 
    userOne,
    userTwoId,
    userTwo,
    cart1,
    cart2,
    setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create cart for user', async () => {
    const response = await request(app)
        .post('/api.carts')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            products:[{
                _id:"item1",
                productid:2,
                quantity:120
            }],
            owner:userOne._id
        })
        .expect(201)
      const cart = await Cart.findById(response.body._id)
      expect(cart).not.toBeNull()
})

test('Should fetch user cart ', async () => {
    const response = await request(app)
        .get('/api.carts')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
})
/*
test('Should not delete other users carts', async () => {
    const response = await request(app)
        .delete(`/api.carts/${cart2._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(401)
  
})

test('Should delete the specific product from the cart of the  user', async () => {
    const response = await request(app)
        .patch(`/api.carts/${cart2._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            "_id": "item2"
        }   
        ).expect(200)
})

test('Should Add new products to existing cart of user', async () => {
    const response = await request(app)
        .post(`/api.carts/${cart2._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            "_id":"item5",
            "productid":3,
            "quantity":3
    }).expect(200)
})



test('Should delete users cart', async () => {
    const response = await request(app)
        .delete(`/api.carts/${cart2._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(200)
})
*/