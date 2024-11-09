const pool = require('../db/db');
const AppError = require("../utils/errorUtils");

const checkUserExists = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        return result.rowCount > 0;
    } catch (error) {
        throw new AppError('Database error while checking userId.', 500);
    }
};

module.exports={
    checkUserExists
}