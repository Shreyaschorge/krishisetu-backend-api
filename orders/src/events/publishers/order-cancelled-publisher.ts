import { Subjects, Publisher, OrderCancelledEvent } from '@krishisetu/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
