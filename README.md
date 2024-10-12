This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

`Project powered by API on a AWS EC2 Ubuntu Machine;`

## Getting Started 🇺🇸

First, run the development server:

```bash
npm -i
# or
yarn
```

Then, you are able to run
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

`If you are running on your local machine open:`
[http://localhost:3000](http://localhost:3000) with your browser to see the result.

> [!NOTE]
> This application is available on:
> (https://doqrtestewebsite.vercel.app/)

![Screenshot of the first page on this project]
(https://i.imgur.com/9eQLi6R.png)

### PROJECT TREE:
```bash
├── .env                    
├── .eslintrc.json         
├── next.config.mjs         
├── package.json            
├── tailwind.config.ts      
├── src
│   ├── animations          
│   ├── app                 
│   │   ├── (dashboard)     
│   │   ├── employee        
│   ├── components          
│   ├── domains             
│   ├── models              
│   └── utils               
```
1. **Frontend**: Interface built with **Next.js** and **React**.
2. **Backend**: API developed in **.NET Core** for data management. [GitHub](https://github.com/GabrielDesk/doQrApi)

## Objective

Develop an employee registration system that enables:
- Inserting, editing, deleting, and viewing employees.
- Listing all employees or filtering by name.

Each employee has the following fields:
- **Name**
- **Email**
- **CPF**
- **Phone/Cell**
- **Birth Date**
- **Employment Type** (PJ or CLT)
- **Status** (Active or Inactive)

## Technology Stack

- **Next.js** with **React** and **TypeScript**
- **Tailwind CSS** for styling
- **React Hooks** and **AsyncStorage** for state management

---

## 1. Frontend (Next.js)

### Description

The frontend is responsible for presenting a user interface for employee management, including features such as:
- Displaying a list of employees with search and filter capabilities.
- Allowing the creation, editing, and deletion of employee records.
- Implementing field validation (e.g., CPF and Email) to ensure data accuracy.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Getting Started 🇧🇷

Primeiro, intale todas dependencias do projeto:

```bash
npm -i
# or
yarn
```

Agora, você está apto a rodar o projeto
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

`Se você estiver rodando o projeto em sua máquina, abra` [http://localhost:3000](http://localhost:3000) com o seu navegador para ver o resultado.

> [!NOTE]
> Esta aplicação está disponível em:
> (https://doqrtestewebsite.vercel.app/)

### ÁRVORE DO PROJETO:
```bash
├── .env                    
├── .eslintrc.json         
├── next.config.mjs         
├── package.json            
├── tailwind.config.ts      
├── src
│   ├── animations          
│   ├── app                 
│   │   ├── (dashboard)     
│   │   ├── employee        
│   ├── components          
│   ├── domains             
│   ├── models              
│   └── utils               
```

1. **Frontend**: Interface construída com **Next.js** e **React**.
2. **Backend**: API desenvolvida em **.NET Core** para gerenciamento de dados. [GitHub](https://github.com/GabrielDesk/doQrApi)

## Objetivo

Desenvolver um sistema de cadastro de funcionários que permita:
- Inserir, editar, excluir e consultar funcionários.
- Listar todos os funcionários ou filtrar por nome.

Cada funcionário possui os seguintes campos:
- Nome
- E-mail
- CPF
- Telefone/Celular
- Data de Nascimento
- Tipo de Contratação (PJ ou CLT)
- Status (Ativo ou Inativo)

### Stack Tecnológica

- **Next.js** com **React** e **TypeScript**
- **Tailwind CSS** para estilização
- **Hooks do React** e **AsyncStorage** para controle de estado

## 1. Frontend (Next.js)

### Descrição

O frontend é responsável por exibir uma interface de usuário para o gerenciamento de funcionários. Inclui funcionalidades como:
- Exibir uma lista de funcionários com opção de busca e filtro.
- Permitir a criação, edição e exclusão de funcionários.
- Validação de campos, como CPF e E-mail, para assegurar dados corretos.
