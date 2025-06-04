const {createPool} = require('mysql2/promise')

const DB_HOST = process.env.DB_HOST || '10.0.21.144'
const DB_USER = process.env.DB_USER || 'root'
const DB_PASSWORD = process.env.DB_PASSWORD || 'db_citas'
const DB_NAME = process.env.DB_NAME || 'db_citas'
const DB_PORT = process.env.DB_PORT || 3306

const pool = createPool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME
})

module.exports = pool