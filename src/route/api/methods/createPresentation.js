import * as utils from "../../../utils";
import * as models from "../../../models";

export function createPresentationRequest( req, res, next ) {
  return createPresentation(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

export async function createPresentation( params ) {
  let {  } = params;
  return models.Presentation.create({
    qrCode: await utils.generateShaString(1 << 5),
    shortKey: await utils.generateCryptoToken(1 << 2)
  });
}