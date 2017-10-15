import Sequelize from 'sequelize';
import sequelize from '../sequelize';

let Presentation = sequelize.define('Presentation', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    defaultValue: 'Unnamed presentation'
  },
  qrCode: {
    type: Sequelize.STRING
  },
  // short url for others
  shortKey: {
    type: Sequelize.STRING
  },
  slideNumber: {
    type: Sequelize.INTEGER.UNSIGNED,
    defaultValue: 1
  }
}, {
  paranoid: true,
  engine: 'INNODB',
  indexes: [{
    name: 'short_key_index',
    method: 'BTREE',
    fields: [ 'shortKey' ]
  }, {
    name: 'admin_access_index',
    method: 'BTREE',
    fields: [ 'qrCode' ]
  }]
});

export default Presentation;