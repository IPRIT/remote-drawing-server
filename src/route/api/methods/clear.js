import * as utils from "../../../utils";
import * as models from "../../../models";
import { SocketIoManager } from "../../../socket.io/socket-manager";

export function clearRequest( req, res, next ) {
  return clear(
    utils.extractAllParams( req )
  ).then(result => {
    res.json(result);
  }).catch(next);
}

/**
 * @param {{ token: string, number: number }} params
 */
export async function clear( params ) {
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
  let socketManager = SocketIoManager.getInstance();
  socketManager.emitChannelEvent( presentation.id, 'room.clear', { } );
  return presentation;
}