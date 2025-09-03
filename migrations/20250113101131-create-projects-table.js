'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        userId INTEGER UNSIGNED NOT NULL,

        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NULL,

        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS projects;'
    );
  },
};
