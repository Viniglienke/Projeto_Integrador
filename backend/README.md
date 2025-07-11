# 🌱 BioUrb API – Sistema de Controle de Arborização Urbana

API RESTful para o gerenciamento de usuários e árvores, permitindo cadastro, autenticação e CRUD de árvores. Desenvolvido com **Node.js**, **Express** e **PostgreSQL**.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **JWT** (JSON Web Token)
- **bcryptjs** (criptografia de senhas)
- **Swagger** (documentação da API – disponível localmente)
- **Vercel** (deploy backend)
- **dotenv** (variáveis de ambiente)

---

## 📁 Estrutura do Projeto

```
├── index.js               # Arquivo principal da aplicação
├── .env                   # Variáveis de ambiente (não versionado)
├── package.json           # Dependências e scripts
├── vercel.json            # Configuração do Vercel
└── README.md              # Este arquivo
```

---

## 🔧 Instalação e Execução Local

### Pré-requisitos

- Node.js instalado
- PostgreSQL rodando
- Criar banco com as tabelas `usuario` e `arvore`

### 1. Clonar o repositório

```bash
git clone https://github.com/Viniglienke/Projeto_Integrador.git
cd .\backend\
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o arquivo `.env`

Crie um arquivo `.env` com o seguinte conteúdo:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nomedobanco
JWT_SECRET=sua_chave_secreta
API_URL=http://localhost:3001
```

### 4. Rodar o servidor localmente

```bash
node index.js
```

O servidor estará rodando em: [http://localhost:3001](http://localhost:3001)

---

## 📚 Documentação da API

A documentação Swagger está disponível **apenas localmente**, em:

```
http://localhost:3001/api-docs
```

---

## 🔐 Endpoints Principais

### Autenticação

| Método | Rota      | Descrição                  |
|--------|-----------|----------------------------|
| POST   | /register | Registro de novo usuário   |
| POST   | /login    | Login e geração de token   |

### Árvores

| Método | Rota          | Descrição                     |
|--------|---------------|-------------------------------|
| GET    | /trees        | Listar todas as árvores       |
| POST   | /trees        | Cadastrar nova árvore         |
| PUT    | /trees/:id    | Atualizar árvore existente    |
| DELETE | /trees/:id    | Remover árvore por ID         |

---

## 📦 Deploy

O backend está em produção na Vercel:  
🔗 https://api-biourb.vercel.app

> ⚠️ A documentação Swagger não funciona em produção por limitações da Vercel. Use localmente.

---

## 🗃️ Banco de Dados – Exemplo de Estrutura

```sql
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(20) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE arvore (
    id SERIAL PRIMARY KEY,
    nome_cientifico VARCHAR(255) NOT NULL,
    data_plantio DATE NOT NULL,
    estado_saude VARCHAR(255) NOT NULL,
    localizacao TEXT NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT fk_arvore_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## 👨‍💻 Desenvolvedor

Vinícius • [GitHub](https://github.com/Viniglienke)
