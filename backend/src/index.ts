import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/status', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/users', (req, res) => {
  const { name, email, document, password } = req.body;
  
  console.log('Dados recebidos:', { name, email, document, password });
  
  // Validações
  const errors: string[] = [];
  
  // Validação do nome
  if (!name) {
    errors.push('Nome é obrigatório');
  } else if (name.length < 2 || name.length > 100) {
    errors.push('Nome deve ter entre 2 e 100 caracteres');
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
    errors.push('Nome deve conter apenas letras e espaços');
  }
  
  // Validação do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Email é obrigatório');
  } else if (!emailRegex.test(email)) {
    errors.push('Email inválido');
  } else if (email.length > 255) {
    errors.push('Email deve ter no máximo 255 caracteres');
  }
  
  // Validação da senha
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password) {
    errors.push('Senha é obrigatória');
  } else if (!passwordRegex.test(password)) {
    errors.push('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
  }
  
  // Se houver erros, retorna 400
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      message: errors.join(', ')
    });
  }
  
  // Gera o ID e retorna sucesso
  const userId = uuidv4();
  const createdAt = new Date().toISOString();
  
  res.status(201).json({
    id: userId,
    name,
    email,
    created_at: createdAt
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});