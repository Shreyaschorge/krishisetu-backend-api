import AWS from 'aws-sdk';
import express, { Request, Response } from 'express';
import { requireAuth } from '@krishisetu/common';
import { v1 as uuid } from 'uuid';


const router = express.Router();

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3();

router.get('/api/products/upload/', requireAuth, async (req: Request, res: Response) => {

  const key = `${req.currentUser!.id}/${uuid()}.jpeg`;

  const url = await s3.getSignedUrlPromise(
    'putObject',
    {
      Bucket: 'krishisetu',
      ContentType: 'image/jpeg',
      Key: key
    },
  );

  res.send({key, url}).status(200);
});

export { router as uploadImageRouter };