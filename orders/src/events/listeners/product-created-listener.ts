import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ProductCreatedEvent } from '@krishisetu/common';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price, description, imageURL } = data;

    const product = Product.build({
      id,
      title,
      imageURL,
      price,
      description
    });
    await product.save();

    msg.ack();
  }
}
