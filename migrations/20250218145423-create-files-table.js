'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS files (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        userId INTEGER UNSIGNED NOT NULL,

        originalName VARCHAR(255) NULL,
        fileKey VARCHAR(255) NOT NULL,
        type TINYINT UNSIGNED NOT NULL COMMENT '1 - avatar, 2 - attachment',
        isUsed BOOLEAN NOT NULL DEFAULT FALSE,
        url VARCHAR(255) NOT NULL,

        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT filesUserIdFk FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS files;');
  },
};
