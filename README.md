# SE100.TechStore

### _SERVER file_

# How to Use NestJS CLI

## Introduction

NestJS CLI is a powerful tool that helps developers quickly scaffold and manage NestJS applications. This README provides a guide on how to use the CLI effectively after installation.

## Prerequisites

Before using the NestJS CLI, make sure it’s installed. If not, install it globally:

```bash
npm install -g @nestjs/cli
```

## Database management tools PRISMA

https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql

### STEPS

1. Define url string connection mysql://USER:PASSWORD@HOST:PORT/DATABASE
2. Connect and create migrate database by this cmd

```bash
npx prisma migrate dev --name init
```

3. Last steps

```bash
npx prisma generate
```
