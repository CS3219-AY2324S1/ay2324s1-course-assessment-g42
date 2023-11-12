require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host     : process.env.PSQL_HOSTNAME,
    user     : process.env.PSQL_USERNAME,
    password : process.env.PSQL_PASSWORD,
    port     : process.env.PSQL_PORT    
});

pool.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Error connecting to the database', err));

pool.query(
    `CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        collaborated VARCHAR(255) NOT NULL,
        title TEXT NOT NULL,
        qnid INT NOT NULL,
        difficulty VARCHAR(255) NOT NULL,
        language VARCHAR(255) NOT NULL,
        attempt TEXT,
        date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );`).catch(error => console.log("cannot create"));

module.exports = pool;
