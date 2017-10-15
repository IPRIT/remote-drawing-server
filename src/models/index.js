import Log from 'log4js';
import sequelize from './sequelize';
import AuthToken from './AuthToken';
import Presentation from './Presentation';
import PresentationFile from './PresentationFile';
import File from './File';

const log = Log.getLogger('models');

log.info('Models are syncing...');
sequelize.sync(/**{ force: true }/**/).then(() => {
  log.info('Models synced!');
}).catch(log.fatal.bind(log, 'Error:'));

/**
 * Define relatives between models
 */
Presentation.hasMany(AuthToken, { foreignKey: 'sessionId', targetKey: 'id' });
AuthToken.belongsTo(Presentation, { foreignKey: 'sessionId', targetKey: 'id' });

Presentation.belongsToMany(File, { through: PresentationFile, foreignKey: 'presentationId' });
File.belongsToMany(Presentation, { through: PresentationFile, foreignKey: 'fileId' });

export {
  AuthToken, Presentation, File, PresentationFile
};
