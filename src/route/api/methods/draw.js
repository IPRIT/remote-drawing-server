import * as utils from "../../../utils";
import * as models from "../../../models";

export function drawRequest( req, res, next ) {
  return draw(
    utils.extractAllParams( req )
  ).then(() => {
    res.json({ status: 'ok' });
  }).catch(next);
}

export async function draw( params ) {
  let {
    token,
    presentationId,
    presentation
  } = params;
  if (!presentation) {
    presentation = await utils.getPresentationByAuthToken( token );
  }
  if (!presentation) {
    throw new HttpError('You have no permissions', 403);
  }
  if (presentation.id != presentationId) {
    throw new HttpError('Presentation not found', 403);
  }
  return presentation;
}