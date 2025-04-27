const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Middleware para verificar o token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'secreta-chave-do-jwt', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Criar mensagem
router.post('/', authenticateToken, async (req, res) => {
    const { content } = req.body;

    try {
        const message = new Message({
            content,
            author: req.user.id
        });

        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar mensagem' });
    }
});


//listar as mensagens
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('author', 'firstName lastName email') 
            .sort({ createdAt: -1 });

       
        const messagesWithUserDetails = messages.map(message => ({
            messageId: message._id,
            content: message.content,
            userId: message.author._id,
            username: `${message.author.firstName} ${message.author.lastName}`,
            email: message.author.email, 
            createdAt: message.createdAt
        }));

        res.json(messagesWithUserDetails);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar mensagens' });
    }
});



// Editar mensagem
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Mensagem não encontrada' });

        if (message.author.toString() !== req.user.id)
            return res.status(403).json({ message: 'Não autorizado' });

        message.content = req.body.content;
        await message.save();
        res.json(message);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao editar mensagem' });
    }
});

// Deletar mensagem
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Mensagem não encontrada' });

        if (message.author.toString() !== req.user.id)
            return res.status(403).json({ message: 'Não autorizado' });

        await message.deleteOne();
        res.json({ message: 'Mensagem deletada' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar mensagem' });
    }
});

module.exports = router;
