import Sequelize from 'sequelize';
import sequelize from '../sequelize';

let File = sequelize.define('File', {
  uuid: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  fileType: {
    type: Sequelize.ENUM('image'),
    defaultValue: 'image'
  },
  fileName: {
    type: Sequelize.STRING,
    defaultValue: 'Unnamed file'
  },
  fileUrl: {
    type: Sequelize.STRING
  }
}, {
  paranoid: true,
  engine: 'INNODB',
  indexes: [{
    name: 'type_index',
    method: 'BTREE',
    fields: [ 'fileType' ]
  }]
});

export default File;