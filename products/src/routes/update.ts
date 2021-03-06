import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@krishisetu/common';
import { Product } from '../models/product';
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/products/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
    body("description").not().isEmpty().isLength({min: 30}).withMessage("Text length must be greater than 30 characters")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new NotFoundError();
    }

    if (product.orderId) {
      throw new BadRequestError('Cannot edit a reserved product');
    }

    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    product.set({
      title: req.body.title,
      price: req.body.price,
      imageURL: req.body.imageURL,
      description: req.body.description,
    });
    await product.save();
    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      imageURL: product.imageURL,
      description: product.description,
      userId: product.userId,
      version: product.version,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
