const request = require('supertest')
const app = require('../src/app')
const Product = require('../src/models/product')
const { 
    userOneId, 
    userOne,
    userTwoId,
    userTwo,
    userAdminId,
    userAdmin,
    product1,
    product2,setupDatabase 
} = require('./fixtures/db')

beforeEach(setupDatabase)
test('check if product is present',async () => {
// Assert that the database was changed correctly
const product = await Product.findById(product1._id)
expect(product).not.toBeNull()

})
   
test('Should create cart for user', async () => {
    const response = await request(app)
        .post('/api.products')
        .set('Authorization', `Bearer ${userAdmin.tokens[0].token}`)
        .send(
            {
                _id:3,	
                name:'Life boy  Natural Germ Protection Handwash',
                category:'Pantry',
                price:'99',
                instock:true,
                stock:150
            }
        ).expect(201)
      const products = await Product.findById(response.body._id)
      expect(products).not.toBeNull()
     
})

test('should fetch products ', async () => {
    const response = await request(app)
    .get('/api.products') 
    .send()
    .expect(200)
})

test('should fetch a single products ', async () => {
    const response = await request(app)
    .get(`/api.products/${product1._id}`) 
    .send()
    .expect(200)
})

test('should  delete products if user is authorised and Admin ', async () => {
    const response = await request(app)
    .delete(`/api.products/${product1._id}`)
    .set('Authorization',`Bearer ${userAdmin.tokens[0].token}`)
    .send()
    .expect(200)
  const product = await Product.findById(product1._id) 
  expect(product).toBeNull()
})

test('should not delete products if un-authorised ', async () => {
    const response = await request(app)
    .delete(`/api.products/${product1._id}`)
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(401)
  const product = await Product.findById(product1._id) 
  expect(product).not.toBeNull()
})
test('Should allow to update valid product fields if its Admin', async () => {
        const response =  await request(app)
        .patch(`/api.products/${product1._id}`)
        .set('Authorization', `Bearer ${userAdmin.tokens[0].token}`)
        .send({	
            name:"aata",
            category:"grocery",
            price:300,
            instock:true
        })
        .expect(200)
    const product = await Product.findById(product1._id)
    expect(product.name).toEqual('aata')
})

test('Should not allow to update valid product fields if its not an Admin', async () => {
    await request(app)
        .patch('/api.products/${product1._id}')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({	
            name:"aata",
            category:"grocery",
            price:300,
            instock:true
        })
        .expect(401)
  
})
