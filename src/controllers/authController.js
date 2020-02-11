const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(params = {}) {

    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

/**
 * Method Post
 */
router.post('/register', async (req, res) => {
    const { email } = req.body; // Pegando Email da Requisição.

    try {

        if (await User.findOne({ email }))//Verificando Usuario Existente.
            return res.status(400).send({ error: 'User already exists' })

        const user = await User.create(req.body);

        user.password = undefined;//Apagando Password.

        return res.send({ 
            user,
            token: generateToken({ id: user.id }),  
        });

    } catch (err) {

        return res.status(400).send({ error: 'Registration failed' })
    }
});

router.post('/authenticate', async (req, res) => {//recebendo dados do usuario que esta se logando.
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: "User not found" });
    }
    if (!await bcrypt.compare(password, user.password))

        return res.status(400).send({ error: "Invalid password" });

    //Resetando password
    user.password = undefined;

    //Criando Token de acesso.
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400,
    });

    res.send({ 
        user, 
        token: generateToken({ id: user.id }), 
    });

});

module.exports = app => app.use('/auth', router);
