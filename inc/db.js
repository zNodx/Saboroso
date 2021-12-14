const mysql = require('mysql2');

const connection = mysql.createConnection({

    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password: 'Nodmat3us@',
    multipleStatements: true

});

module.exports = connection;