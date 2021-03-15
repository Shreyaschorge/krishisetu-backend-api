import { Publisher, Subjects, ProductCreatedEvent } from '@krishisetu/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}