import express, { Request, Response } from 'express';
import { requireAuth } from '@krishisetu/common';
import { Product } from '../models/product';

const router = express.Router();

router.get('/api/products/userProducts', requireAuth, async (req: Request, res: Response) => {
  const products = await Product.find({
    userId: req.currentUser!.id,
  });

  res.send(products);
});

export { router as userProductsRouter };