const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is not defined in .env file');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 60000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(1);
});

const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    pool.end(() => {
        console.log('Database pool closed successfully');
        process.exit(0);
    });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

const attemptConnection = () => {
    pool.connect()
        .then(client => {
            console.log('Successfully connected to the database');
            client.release();
        })
        .catch(err => {
            console.error('Database connection error', err);
            process.exit(1);
        });
};

attemptConnection();

module.exports = pool;
