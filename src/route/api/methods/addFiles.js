import * as utils from "../../../utils";
import * as models from "../../../models";

export function addFilesRequest( req, res, next ) {
  return addFiles(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

export async function addFiles( params ) {
  let {
    presentationId, presentation,
    name = '',
    files = []
  } = params;
  if (!presentation) {
    presentation = await models.Presentation.findByPrimary( presentationId );
  }
  if (!presentation) {
    throw new HttpError('Presentation not found', 404);
  }
  let newFiles = [];
  for (let i = 0; i < files.length; ++i) {
    newFiles.push(
      await models.File.create( files[i] )
    );
  }
  await presentation.addFiles( newFiles );
  return presentation.update({
    name
  });
}