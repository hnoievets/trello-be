'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
        ALTER TABLE users 
         ADD COLUMN avatarId INTEGER UNSIGNED NULL,
         ADD CONSTRAINT usersAvatarIdFk FOREIGN KEY (avatarId) REFERENCES files(id) ON DELETE SET NULL ON UPDATE CASCADE;
    `);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users 
        DROP CONSTRAINT usersAvatarIdFk,
        DROP COLUMN avatarId;
    `);
  },
};
