import * as utils from "../../../utils";
import * as models from "../../../models";

export function registerDeviceRequest( req, res, next ) {
  return registerDevice(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

export async function registerDevice( params ) {
  let { qrCode } = params;
  let presentation = await models.Presentation.findOne({
    where: {
      qrCode
    }
  });
  if (!presentation) {
    throw new HttpError( 'Wrong qr code or presentation does not exist' );
  }
  return presentation.createAuthToken({
    token: await utils.generateCryptoToken()
  }).then(result => {
    return {
      token: result.token
    }
  });
}