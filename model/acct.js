
const mongoose = require('mongoose');
// const { Schema } = mongoose;

const userAndPwdPattern = new mongoose.Schema({
    username: String,
    password: String,
    uuri: String,
    cond: {
        type: Number,
        default: 1
    }
});

const userInstance = mongoose.model('USER_ACCT_DETAILS_MEN', userAndPwdPattern);
module.exports = userInstance;