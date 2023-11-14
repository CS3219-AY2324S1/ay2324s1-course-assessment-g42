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

const createHistoryTableQuery = `
    DO $$ 
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'history'
      ) THEN
        CREATE TABLE history (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            collaborated VARCHAR(255) NOT NULL,
            title TEXT NOT NULL,
            qnid INT NOT NULL,
            difficulty VARCHAR(255) NOT NULL,
            language VARCHAR(255) NOT NULL,
            attempt TEXT,
            date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES users(username),
            FOREIGN KEY (collaborated) REFERENCES users(username)
        );
      END IF;
    END $$;
  `;
  
pool.query(createHistoryTableQuery)
.then((res) => {
    console.log('Table creation successful:', res);
})
.catch((err) => {
    console.error('Error creating table:', err);
})

module.exports = pool;
