import express from 'express';
import bodyParser from 'body-parser';
import formData from 'express-form-data';
import requestRestrict from 'express-light-limiter';
import { HttpError } from '../utils/http-error';
import cors from './cors';
import apiRouter from './api';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(formData.parse());
router.use(formData.stream());
router.use(formData.union());
router.use(requestRestrict({
  error: new HttpError('Too many requests', 429),
  maxRequestsPerQuantum: 1000
}));

router.all('*', cors);

router.use('/api', apiRouter);

router.all('/*', function(req, res, next) {
  next(new HttpError('Not found', 404));
});

export default router;