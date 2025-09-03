'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        
        projectId INTEGER UNSIGNED NOT NULL,
        columnId INTEGER UNSIGNED NULL,
        
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NULL,
        estimate INTEGER UNSIGNED NULL,
        position DECIMAL(10, 1) UNSIGNED NULL,
        isDone BOOLEAN NOT NULL DEFAULT FALSE,
        
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (columnId) REFERENCES columns(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;`
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS tasks;');
  },
};
