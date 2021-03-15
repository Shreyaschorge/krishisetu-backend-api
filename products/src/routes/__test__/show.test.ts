import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send().expect(404);
});

it('returns the product if the product is found', async () => {
  const title = 'concert';
  const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
  const price = 20;

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title,
      description,
      price,
    })
    .expect(201);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200);

  expect(productResponse.body.title).toEqual(title);
  expect(productResponse.body.description).toEqual(description);
  expect(productResponse.body.price).toEqual(price);
});
