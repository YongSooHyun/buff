const env = process.env

module.exports = {
  "type": "mariadb",
  "host": env.DB_HOST,
  "port": env.DB_PORT,
  "username": env.DB_USER,
  "password": env.DB_PASSWORD,
  "database": env.DB_DATABASE,
  "entities": ["dist/typeorm/*.js"],
  "seeds": ["dist/typeorm/seeds/*.js"],
  "synchronize": true
}