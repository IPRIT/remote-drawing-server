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
    shortKey: parseInt(Math.random().toFixed(7).replace('0.', '')).toString(16)
  });
}