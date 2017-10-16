import express from 'express';
import * as methods from './methods';

const router = express.Router();

router.post('/register-device', methods.registerDeviceRequest);

router.post('/presentations', methods.createPresentationRequest);
router.get('/presentations/:presentationId', methods.getPresentationRequest);
router.get('/presentations/:presentationId/qr', methods.getQrCodeRequest);
router.post('/presentations/:presentationId', methods.addFilesRequest);

router.post('/presentations/:presentationId/slide/:number', methods.setSlideNumberRequest);
router.post('/presentations/:presentationId/draw', methods.drawRequest);

export default router;