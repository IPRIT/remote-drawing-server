import * as utils from "../../../utils";
import * as models from "../../../models";
import qr from 'qrcode-js';

export function getQrCodeRequest( req, res, next ) {
  return getQrCode(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

export async function getQrCode( params ) {
  let { presentationId } = params;
  let presentation = await models.Presentation.findOne({
    where: {
      $or: {
        id: presentationId,
        shortKey: presentationId
      }
    }
  });
  if (!presentation) {
    throw new HttpError('Presentation not found');
  }
  let dataURL = qr.toDataURL( presentation.qrCode, 7 );
  return { qr: dataURL };
}