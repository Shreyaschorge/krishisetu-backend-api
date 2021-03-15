import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@krishisetu/common';
import { Product } from '../models/product';
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/products',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body("description").not().isEmpty().isLength({min: 30}).withMessage("Text length must be greater than 30 characters")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description, quantity } = req.body;

    const product = Product.build({
      title,
      price,
      description,
      userId: req.currentUser!.id,
    });
    await product.save();
    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      price: product.price,
      userId: product.userId,
      description: product.description,
      version: product.version
    });

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
