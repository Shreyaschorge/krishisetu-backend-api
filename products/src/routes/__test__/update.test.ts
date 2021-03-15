import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Product } from '../../models/product';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path",
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(401);
});

it('returns a 401 if the user does not own the product', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'alskdjflskjdf',
      price: 1000,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title, description or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(400);

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(400);

    await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
      description: "erwerg"
    })
    .expect(400);
});

it('updates the product provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(200);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();

  expect(productResponse.body.title).toEqual('new title');
  expect(productResponse.body.price).toEqual(100);
  expect(productResponse.body.description).toEqual("You can also freely specify an app to open the file. You need to type the whole path");
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the product is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    });

  const product = await Product.findById(response.body.id);
  product!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await product!.save();

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
      description: "You can also freely specify an app to open the file. You need to type the whole path"
    })
    .expect(400);
});
