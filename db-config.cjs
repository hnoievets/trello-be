const dotenv = require('dotenv');

try {
  const env = process.env.NODE_ENV || 'local';

  dotenv.config({ path: `.env${env ? `.${env}` : ''}` });
} catch {
  console.log('ERROR: env file does not exist');
}

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
