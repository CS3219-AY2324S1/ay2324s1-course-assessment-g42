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

module.exports = pool;
