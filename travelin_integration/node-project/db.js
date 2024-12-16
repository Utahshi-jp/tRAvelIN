// db.js
const mysql = require('mysql');

const createConnection = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "it232115Root",
        database: "travelin_DB",
    });
};

module.exports = createConnection;
