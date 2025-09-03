'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS taskAttachments (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        
        taskId INTEGER UNSIGNED NOT NULL,
        fileId INTEGER UNSIGNED NOT NULL,

        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT taskAttachmentsTaskIdFk FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT taskAttachmentsFileIdFk FOREIGN KEY (fileId) REFERENCES files(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS taskAttachments;');
  },
};
