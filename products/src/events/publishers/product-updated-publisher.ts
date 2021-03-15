import { Publisher, Subjects, ProductUpdatedEvent } from '@krishisetu/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
