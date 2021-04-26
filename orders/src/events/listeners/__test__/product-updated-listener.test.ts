import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ProductUpdatedEvent } from '@krishisetu/common';
import { ProductUpdatedListener } from '../product-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Product } from '../../../models/product';

const setup = async () => {
  // Create a listener
  const listener = new ProductUpdatedListener(natsWrapper.client);

  // Create and save a product
  const product = Product.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    imageURL: 'imageURL',
    description: 'desc',
    price: 20,
  });
  await product.save();

  // Create a fake data object
  const data: ProductUpdatedEvent['data'] = {
    id: product.id,
    version: product.version + 1,
    title: 'new concert',
    imageURL: 'new imageURL',
    price: 999,
    description: 'desc',
    userId: 'ablskdjf',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, product, listener };
};

it('finds, updates, and saves a product', async () => {
  const { msg, data, product, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.imageURL).toEqual(data.imageURL);
  expect(updatedProduct!.description).toEqual(data.description);
  expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, product } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
