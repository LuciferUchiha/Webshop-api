const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'modul150User',
    password: '1234',
    database: 'modul150'
})

const getConnection = () => {
    return pool
}

module.exports = getConnection;