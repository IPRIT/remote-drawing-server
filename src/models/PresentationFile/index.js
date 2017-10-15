import Sequelize from 'sequelize';
import sequelize from '../sequelize';

let PresentationFile = sequelize.define('PresentationFile', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  }
}, {
  paranoid: true,
  engine: 'INNODB',
  indexes: []
});

export default PresentationFile;