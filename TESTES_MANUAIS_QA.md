# 📋 Plano de Testes Manuais - Tela de Signup

## 🎯 Objetivo
Validar o funcionamento completo da tela de cadastro de usuários, incluindo validações, interações e comportamento visual.

## 🔧 Pré-requisitos
- Backend rodando na porta 3000 (`cd backend && npm run dev`)
- Frontend rodando na porta 3001 (`cd frontend && npm run dev`)
- Navegadores para teste: Chrome, Firefox, Safari, Edge
- Testar em diferentes resoluções: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

---

## 📱 Testes de Layout e Responsividade

### TEST-001: Verificar Layout Desktop
**Passos:**
1. Abrir aplicação em resolução 1920x1080
2. Verificar se o layout está em grid com sidebar à esquerda
3. Verificar se o formulário está centralizado na área principal
4. Verificar se todos os elementos estão alinhados corretamente

**Resultado Esperado:**
- Layout em grid com 12 colunas
- Sidebar ocupa 3 colunas
- Área principal ocupa 9 colunas
- Todos os textos legíveis e bem espaçados

### TEST-002: Verificar Layout Mobile
**Passos:**
1. Redimensionar navegador para 375x667 ou usar DevTools
2. Verificar se sidebar aparece acima do formulário
3. Verificar se campos ocupam largura total
4. Verificar se botões são facilmente clicáveis

**Resultado Esperado:**
- Layout em coluna única
- Sidebar aparece primeiro
- Formulário abaixo com campos em largura total
- Botões com tamanho adequado para toque

---

## 🌓 Testes de Tema (Light/Dark Mode)

### TEST-003: Alternar entre Temas
**Passos:**
1. Clicar no botão de lua/sol no header
2. Verificar mudança de cores em todos elementos
3. Recarregar página (F5)
4. Verificar se tema foi mantido

**Resultado Esperado:**
- Tema alterna entre claro e escuro
- Todas as cores mudam adequadamente
- Não há elementos com cores quebradas
- Tema persiste após recarregar

### TEST-004: Contraste em Modo Escuro
**Passos:**
1. Ativar modo escuro
2. Verificar legibilidade de todos os textos
3. Verificar contraste dos placeholders
4. Verificar visibilidade das bordas

**Resultado Esperado:**
- Todos os textos claramente legíveis
- Placeholders visíveis mas sutis
- Bordas dos cards e inputs visíveis
- Ícones com cor adequada

---

## 📝 Testes de Formulário

### TEST-005: Campos Obrigatórios Vazios
**Passos:**
1. Deixar todos os campos vazios
2. Clicar em "Criar conta"
3. Verificar comportamento

**Resultado Esperado:**
- Navegador mostra validação HTML5
- Foco vai para primeiro campo vazio
- Formulário não é enviado

### TEST-006: Preenchimento Completo com Dados Válidos
**Passos:**
1. Preencher:
   - Nome: "João Silva Santos"
   - Email: "joao.silva@email.com"
   - Documento: "123.456.789-00"
   - Senha: "SenhaForte123"
2. Clicar em "Criar conta"
3. Aguardar resposta

**Resultado Esperado:**
- Botão muda para "Criando..."
- Mensagem verde de sucesso aparece
- Mostra ID do usuário criado
- Todos os campos são limpos

### TEST-007: Validação de Nome
**Casos de Teste:**
1. Nome com 1 caractere: "A"
2. Nome com números: "João123"
3. Nome com caracteres especiais: "João@Silva"
4. Nome válido com acentos: "José Antônio"
5. Nome com 100 caracteres (válido)
6. Nome com 101 caracteres (inválido)

**Resultado Esperado:**
- Casos 1, 2, 3, 6: Erro de validação
- Casos 4, 5: Sucesso
- Mensagem de erro específica para cada caso

### TEST-008: Validação de Email
**Casos de Teste:**
1. Email sem @: "joaoemail.com"
2. Email sem domínio: "joao@"
3. Email sem ponto: "joao@emailcom"
4. Email com espaços: "joao silva@email.com"
5. Email válido: "joao.silva+teste@email.com.br"
6. Email com 255 caracteres (válido)
7. Email com 256 caracteres (inválido)

**Resultado Esperado:**
- Casos 1-4, 7: Erro de validação
- Casos 5, 6: Sucesso
- HTML5 também valida formato básico

### TEST-009: Validação de Senha
**Casos de Teste:**
1. Senha com 7 caracteres: "Senha12"
2. Senha sem maiúscula: "senha123"
3. Senha sem minúscula: "SENHA123"
4. Senha sem número: "SenhaForte"
5. Senha válida mínima: "Senha123"
6. Senha complexa: "S3nh@F0rt3!2024"

**Resultado Esperado:**
- Casos 1-4: Erro específico de validação
- Casos 5, 6: Sucesso
- Mensagem clara sobre requisitos

### TEST-010: Múltiplos Erros de Validação
**Passos:**
1. Preencher:
   - Nome: "J"
   - Email: "email-invalido"
   - Documento: "123"
   - Senha: "123"
2. Submeter formulário

**Resultado Esperado:**
- Mensagem de erro concatenando todos os problemas
- Formulário não é limpo
- Usuário pode corrigir e reenviar

---

## 🔄 Testes de Estado e Interação

### TEST-011: Estado de Loading
**Passos:**
1. Preencher formulário com dados válidos
2. Clicar em "Criar conta"
3. Observar botão durante requisição

**Resultado Esperado:**
- Botão desabilitado durante loading
- Texto muda para "Criando..."
- Não é possível clicar novamente
- Cursor muda para "not-allowed"

### TEST-012: Múltiplas Submissões Rápidas
**Passos:**
1. Preencher com dados válidos
2. Clicar rapidamente 5 vezes no botão

**Resultado Esperado:**
- Apenas uma requisição é enviada
- Botão desabilita após primeiro clique
- Sem comportamentos inesperados

### TEST-013: Navegação por Tab
**Passos:**
1. Clicar no primeiro campo
2. Navegar com Tab por todos elementos
3. Verificar ordem de navegação

**Resultado Esperado:**
- Ordem: Nome → Email → Documento → Senha → Botão
- Foco visível em todos elementos
- Botão de tema também acessível

---

## 🌐 Testes de Conectividade

### TEST-014: Backend Offline
**Passos:**
1. Parar o backend (Ctrl+C no terminal)
2. Tentar criar usuário
3. Verificar mensagem de erro

**Resultado Esperado:**
- Mensagem "Erro ao conectar com o servidor"
- Formulário mantém dados preenchidos
- Possível tentar novamente

### TEST-015: Timeout de Rede
**Passos:**
1. Usar DevTools → Network → Throttling → Offline
2. Submeter formulário
3. Verificar comportamento

**Resultado Esperado:**
- Loading aparece normalmente
- Após timeout, mensagem de erro
- Dados do formulário preservados

---

## 🎨 Testes Visuais

### TEST-016: Hover States
**Passos:**
1. Passar mouse sobre cada elemento interativo
2. Verificar mudanças visuais

**Elementos para testar:**
- Botão "Criar conta"
- Botão de tema
- Inputs ao receber foco
- Cards informativos

**Resultado Esperado:**
- Mudanças sutis de cor/sombra
- Cursor apropriado para cada elemento
- Transições suaves

### TEST-017: Focus States
**Passos:**
1. Usar Tab para navegar
2. Verificar indicador de foco

**Resultado Esperado:**
- Ring de foco visível
- Cor do ring adequada ao tema
- Foco não some ao clicar

---

## 🔍 Testes de Acessibilidade

### TEST-018: Labels e Placeholders
**Passos:**
1. Verificar se todos inputs têm labels
2. Verificar textos dos placeholders
3. Testar com leitor de tela (se disponível)

**Resultado Esperado:**
- Labels descritivos e visíveis
- Placeholders com exemplos úteis
- Associação correta label-input

### TEST-019: Mensagens de Erro/Sucesso
**Passos:**
1. Provocar erro de validação
2. Criar usuário com sucesso
3. Verificar cores e ícones

**Resultado Esperado:**
- Erro: fundo vermelho claro, texto escuro
- Sucesso: fundo verde claro, texto escuro
- Mensagens claras e específicas

---

## 🐛 Casos Extremos

### TEST-020: Caracteres Especiais
**Teste com:**
- Nome: "José D'Ávila"
- Email: "test+123@email.com"
- Documento: "!@#$%^&*()"
- Senha: "P@ssw0rd!"

**Verificar:**
- Quais são aceitos/rejeitados
- Mensagens de erro apropriadas
- Sem quebra de layout

### TEST-021: Copy/Paste
**Passos:**
1. Copiar dados de outro lugar
2. Colar em cada campo
3. Verificar formatação

**Resultado Esperado:**
- Paste funciona normalmente
- Sem caracteres invisíveis
- Validação funciona igual

### TEST-022: Sessões Múltiplas
**Passos:**
1. Abrir app em duas abas
2. Alterar tema em uma aba
3. Recarregar outra aba

**Resultado Esperado:**
- Tema sincronizado entre abas
- Sem interferência nos formulários
- LocalStorage compartilhado

---

## 📊 Checklist de Aprovação

- [ ] Todos os testes de layout passaram
- [ ] Tema dark/light funciona corretamente
- [ ] Validações funcionam conforme especificado
- [ ] Mensagens de erro são claras
- [ ] Loading states funcionam
- [ ] Sem erros no console do navegador
- [ ] Performance aceitável (< 3s para criar usuário)
- [ ] Funciona nos 4 principais navegadores
- [ ] Responsivo em todas resoluções testadas
- [ ] Acessível via teclado

## 🔔 Observações Importantes

1. **Sempre verificar o console** do navegador para erros JavaScript
2. **Testar com rede lenta** usando throttling do DevTools
3. **Verificar requisições** na aba Network do DevTools
4. **Documentar com screenshots** qualquer comportamento inesperado
5. **Anotar melhorias** de UX que possam ser implementadas

---

**Data do Teste:** ___/___/______  
**Testador:** _________________  
**Versão:** _________________  
**Ambiente:** [ ] Dev [ ] Staging [ ] Prod