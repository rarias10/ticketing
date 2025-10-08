import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser} from '@awatickets/common';
import { createChargeRouter } from './routes/new';


const app = express();



app.set('trust proxy', true);

app.use(bodyParser.json());

app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser as any);
app.use(createChargeRouter);


app.all('*', async (req, res, next) => {
  throw new NotFoundError();
}
);


app.use(errorHandler as any);

export { app };