import request from 'supertest';
import { app } from '../../app';

const createProduct = () => {
  return request(app).post('/api/products').set('Cookie', global.signin()).send({
    title: 'asldkf',
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    price: 20,
  });
};

it('can fetch a list of products', async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get('/api/products').send().expect(200);

  expect(response.body.length).toEqual(3);
});