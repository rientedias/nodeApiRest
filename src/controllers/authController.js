const express = require('express');
const User = require('../models/User');

const router = express.Router();

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

        return res.send({ user });

    } catch (err) {

        return res.status(400).send({ error: 'Registration failed' })
    }
});

module.exports = app => app.use('/auth', router);
