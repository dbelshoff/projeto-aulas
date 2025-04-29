const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const upload = require('../middlewares/uploads');
const User = require('../models/User');

router.post('/register', upload.single('fotoPerfil'), async (req, res) => {
    try {
      // Agora os campos vêm de req.body (porque o FormData envia como campos "textuais" + "arquivo")
      const { firstName, lastName, email, password, sexo, nacionalidade } = req.body;
  
      // Validação extra básica (opcional, mas recomendado)
      if (!firstName || !lastName || !email || !password || !sexo || !nacionalidade) {
        return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'E-mail já cadastrado' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        sexo,
        nacionalidade,
      });
  
      const savedUser = await newUser.save(); // primeiro save para pegar o ID
  
      let finalImagePath;
  
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const newFilename = `user_${savedUser._id}${ext}`;
        const finalPath = path.join(__dirname, '../resource/img', newFilename);
  
        // Mover e renomear o arquivo
        fs.renameSync(req.file.path, finalPath);
  
        // Atualiza caminho relativo salvo no banco
        finalImagePath = `resource/img/${newFilename}`;
      } else {
        // Define imagem padrão conforme sexo
        switch (sexo) {
          case 'Masculino':
            finalImagePath = 'resource/assets/default_masculino.png';
            break;
          case 'Feminino':
            finalImagePath = 'resource/assets/default_feminino.png';
            break;
          default:
            finalImagePath = 'resource/assets/default_indefinido.png';
        }
      }
  
      // Atualizar o pathImage com apenas um update
      await User.findByIdAndUpdate(savedUser._id, { pathImage: finalImagePath });
  
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        userId: savedUser._id,
        pathImage: finalImagePath,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao criar usuário', error: err.message });
    }
  });

module.exports = router;

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
