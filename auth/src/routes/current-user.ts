import express, { Request, Response } from 'express';
import { currentUser } from '@awatickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser as any, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});


export { router as currentUserRouter };