import * as utils from "../../../utils";
import * as models from "../../../models";
import { SocketIoManager } from "../../../socket.io/socket-manager";

export function setSlideNumberRequest( req, res, next ) {
  return setSlideNumber(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

/**
 * @param {{ token: string, number: number }} params
 */
export async function setSlideNumber( params ) {
  let {
    token,
    presentationId,
    presentation,
    number = 1
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
  let slides = await presentation.getFiles();
  number = Math.max(1, Math.min(slides.length, number));

  await presentation.update({
    slideNumber: number
  });
  let socketManager = SocketIoManager.getInstance();
  socketManager.emitChannelEvent( presentation.id, 'room.setSlideNumber', {
    slideNumber: presentation.slideNumber
  } );
  return presentation;
}