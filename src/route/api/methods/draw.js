import * as utils from "../../../utils";
import * as models from "../../../models";
import { SocketIoManager } from "../../../socket.io/socket-manager";

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
    presentation,

    lineWidth = 5,
    color = 0x0,
    alpha = 1,
    x = 0, y = 0,
    lineCode = 0
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
  console.log('lineCode:', lineCode);
  let socketManager = SocketIoManager.getInstance();
  socketManager.emitChannelEvent( presentation.id, 'room.draw', {
    lineWidth,
    color,
    alpha,
    x, y,
    lineCode
  } );
  return presentation;
}
