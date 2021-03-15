import { Publisher, OrderCreatedEvent, Subjects } from '@krishisetu/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}