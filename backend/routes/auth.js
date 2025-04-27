const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

//Cadastro
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'E-mail já cadastrado' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body; 

    try {
        const user = await User.findOne({ email }); 
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ id: user._id }, 'secreta-chave-do-jwt', { expiresIn: '1d' });

        res.json({ token, email: user.email }); 
    } catch (err) {
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});


module.exports = router;
