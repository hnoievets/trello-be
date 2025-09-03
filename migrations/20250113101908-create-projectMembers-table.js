'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS projectMembers (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        userId INTEGER UNSIGNED NOT NULL,
        projectId INTEGER UNSIGNED NOT NULL,
        
        access TINYINT UNSIGNED NOT NULL COMMENT '0 - admin, 1 - write, 2 - read',

        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
        
        UNIQUE KEY unique_userId_projectId (userId, projectId)
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS projectMembers;');
  },
};
