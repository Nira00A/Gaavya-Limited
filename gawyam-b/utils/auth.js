const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};

async function verifyPassword(inputPassword, hashedPassword) {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch (err) {
        console.error('Error comparing passwords:', err);
        throw err;
    }
}

const expiresInSevenDays = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
};

module.exports = { hashPassword , verifyPassword , expiresInSevenDays}