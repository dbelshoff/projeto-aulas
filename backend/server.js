const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

require('dotenv').config(); // Para variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Conexão com MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/forumDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch((err) => console.error('Erro de conexão com MongoDB:', err));

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
