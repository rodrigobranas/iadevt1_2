import axios from 'axios';

describe('Backend Integration Tests', () => {
  const BASE_URL = 'http://localhost:3000';
  const axiosClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    validateStatus: () => true // Don't throw errors for non-2xx status codes
  });

  beforeAll(async () => {
    // Wait a moment to ensure server is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe('GET /status', () => {
    it('should return status ok and message', async () => {
      const response = await axiosClient.get('/status');
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        status: 'ok',
        message: 'Backend is running'
      });
    });
  });

  describe('POST /users', () => {
    describe('Valid user creation', () => {
      it('should create a user with valid data', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('name', userData.name);
        expect(response.data).toHaveProperty('email', userData.email);
        expect(response.data).toHaveProperty('created_at');
        expect(typeof response.data.id).toBe('string');
        expect(typeof response.data.created_at).toBe('string');
        
        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(response.data.id).toMatch(uuidRegex);
        
        // Validate ISO date format
        expect(() => new Date(response.data.created_at)).not.toThrow();
      });

      it('should create a user with minimum valid name length', async () => {
        const userData = {
          name: 'Jo',
          email: 'jo@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('name', userData.name);
      });

      it('should create a user with maximum valid name length', async () => {
        const userData = {
          name: 'a'.repeat(100), // 100 characters
          email: 'long.name@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('name', userData.name);
      });

      it('should create a user with name containing accented characters', async () => {
        const userData = {
          name: 'José María González',
          email: 'jose.maria@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('name', userData.name);
      });

      it('should create a user with maximum valid email length', async () => {
        const longEmail = 'a'.repeat(240) + '@example.com'; // 251 characters total
        const userData = {
          name: 'John Doe',
          email: longEmail,
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('email', userData.email);
      });
    });

    describe('Missing fields validation', () => {
      it('should return 400 when name is missing', async () => {
        const userData = {
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
      });

      it('should return 400 when email is missing', async () => {
        const userData = {
          name: 'John Doe',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email é obrigatório');
      });

      it('should return 400 when password is missing', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha é obrigatória');
      });

      it('should return 400 when all required fields are missing', async () => {
        const userData = {
          document: '12345678901'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
        expect(response.data.message).toContain('Email é obrigatório');
        expect(response.data.message).toContain('Senha é obrigatória');
      });

      it('should return 400 when name is empty string', async () => {
        const userData = {
          name: '',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
      });

      it('should return 400 when email is empty string', async () => {
        const userData = {
          name: 'John Doe',
          email: '',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email é obrigatório');
      });

      it('should return 400 when password is empty string', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: ''
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha é obrigatória');
      });
    });

    describe('Invalid name format validation', () => {
      it('should return 400 when name contains numbers', async () => {
        const userData = {
          name: 'John123',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve conter apenas letras e espaços');
      });

      it('should return 400 when name contains special characters', async () => {
        const userData = {
          name: 'John@Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve conter apenas letras e espaços');
      });

      it('should return 400 when name contains underscores', async () => {
        const userData = {
          name: 'John_Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve conter apenas letras e espaços');
      });
    });

    describe('Name length validation', () => {
      it('should return 400 when name is too short (1 character)', async () => {
        const userData = {
          name: 'J',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve ter entre 2 e 100 caracteres');
      });

      it('should return 400 when name is too long (101 characters)', async () => {
        const userData = {
          name: 'a'.repeat(101), // 101 characters
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve ter entre 2 e 100 caracteres');
      });
    });

    describe('Invalid email format validation', () => {
      it('should return 400 when email has no @ symbol', async () => {
        const userData = {
          name: 'John Doe',
          email: 'johndoeexample.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });

      it('should return 400 when email has no domain', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });

      it('should return 400 when email has no local part', async () => {
        const userData = {
          name: 'John Doe',
          email: '@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });

      it('should return 400 when email has no dot in domain', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });

      it('should return 400 when email has spaces', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });

      it('should return 400 when email has multiple @ symbols', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john@doe@example.com',
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email inválido');
      });
    });

    describe('Email length validation', () => {
      it('should return 400 when email is too long (256 characters)', async () => {
        const longEmail = 'a'.repeat(244) + '@example.com'; // 256 characters total
        const userData = {
          name: 'John Doe',
          email: longEmail,
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Email deve ter no máximo 255 caracteres');
      });
    });

    describe('Invalid password format validation', () => {
      it('should return 400 when password is too short (7 characters)', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Pass123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password has no uppercase letter', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password has no lowercase letter', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'PASSWORD123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password has no number', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password has only letters', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'PasswordOnly'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password has only numbers', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: '12345678'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return 400 when password is exactly 8 characters but missing requirements', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'password'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });
    });

    describe('Multiple validation errors', () => {
      it('should return multiple validation errors when multiple fields are invalid', async () => {
        const userData = {
          name: 'J', // Too short
          email: 'invalid-email', // Invalid format
          document: '12345678901',
          password: 'weak' // Too short, no uppercase, no number
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve ter entre 2 e 100 caracteres');
        expect(response.data.message).toContain('Email inválido');
        expect(response.data.message).toContain('Senha deve ter no mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número');
      });

      it('should return multiple validation errors for name and email', async () => {
        const userData = {
          name: 'John123', // Invalid format
          email: 'a'.repeat(244) + '@example.com', // Too long (256 characters)
          document: '12345678901',
          password: 'Password123'
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome deve conter apenas letras e espaços');
        expect(response.data.message).toContain('Email deve ter no máximo 255 caracteres');
      });
    });

    describe('Edge cases', () => {
      it('should handle request with null values', async () => {
        const userData = {
          name: null,
          email: null,
          document: '12345678901',
          password: null
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
        expect(response.data.message).toContain('Email é obrigatório');
        expect(response.data.message).toContain('Senha é obrigatória');
      });

      it('should handle request with undefined values', async () => {
        const userData = {
          name: undefined,
          email: undefined,
          document: '12345678901',
          password: undefined
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
        expect(response.data.message).toContain('Email é obrigatório');
        expect(response.data.message).toContain('Senha é obrigatória');
      });

      it('should handle empty request body', async () => {
        const response = await axiosClient.post('/users', {});
        
        expect(response.status).toBe(400);
        expect(response.data).toHaveProperty('error', 'Validation failed');
        expect(response.data.message).toContain('Nome é obrigatório');
        expect(response.data.message).toContain('Email é obrigatório');
        expect(response.data.message).toContain('Senha é obrigatória');
      });

      it('should handle request with extra fields', async () => {
        const userData = {
          name: 'John Doe',
          email: 'john.doe@example.com',
          document: '12345678901',
          password: 'Password123',
          extraField: 'should be ignored',
          anotherField: 12345
        };

        const response = await axiosClient.post('/users', userData);
        
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('name', userData.name);
        expect(response.data).toHaveProperty('email', userData.email);
        expect(response.data).not.toHaveProperty('extraField');
        expect(response.data).not.toHaveProperty('anotherField');
      });
    });
  });
});