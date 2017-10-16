import * as utils from "../../../utils";
import * as models from "../../../models";

export function getPresentationRequest( req, res, next ) {
  return getPresentation(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

export async function getPresentation( params ) {
  let { presentationId } = params;
  let where = {};
  if (Number.isFinite(presentationId)) {
    where.id = presentationId;
  } else {
    where.shortKey = presentationId;
  }
  let presentation = await models.Presentation.findOne({
    where,
    attributes: {
      exclude: [ 'qrCode' ]
    },
    include: [ models.File ]
  });
  if (!presentation) {
    // getting presentation by access token
    let authToken = await models.AuthToken.findOne({
      where: {
        token: presentationId
      },
      include: [{
        model: models.Presentation,
        attributes: {
          exclude: [ 'qrCode' ]
        },
        include: [ models.File ]
      }]
    });
    if (!authToken) {
      throw new HttpError('Invalid token');
    }
    presentation = authToken.Presentation;
  }
  if (!presentation) {
    throw new HttpError('Presentation not found');
  }
  return presentation;
}