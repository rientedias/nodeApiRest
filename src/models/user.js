const mongoose = require('../database');
const bcrypt = require('bcryptjs')

/**
 * Criando a Tabela no Mongo DB
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/*
 * Criptografando o Password
 */
UserSchema.pre('save', async function (next) {

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

});

const User = mongoose.model('User', UserSchema);

module.exports = User;