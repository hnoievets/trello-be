## Description

Backend API for a Kanban-style project management tool with authentication, real-time communication, and AWS integrations.

---

## 🚀 Features

- **Auth & Security**
    - JWT-based authentication
    - Email verification using AWS SES

- **Projects**
    - CRUD projects.
    - Configure members, and roles

- **Tasks**
    - CRUD tasks with file attachments (AWS S3 with presigned URLs)
    - Project backlog to view all uncompleted tasks

- **Comments**
    - Real-time task comments with pagination (Socket.IO)

- **Board View**
    - API endpoints for draggable columns and cards

- **User Roles**
    - Role-based permissions for project members: Admin, Write, Read
---

## Technologies

* [node.js 22](https://nodejs.org) - Runtime
* [NestJS](https://docs.nestjs.com) - Backend framework
* [Sequelize](http://docs.sequelizejs.com/) - RDBMS ORM
* [MySQL 8.0](https://dev.mysql.com/doc/refman/8.0/en) - DB
* [Redis](https://redis.io/) - Temporary storage
* [Swagger](https://swagger.io) - API documentation
* [Socket.IO](https://socket.io/docs/v4) - WebSocket features
* [Docker](https://www.docker.com/) - open platform for developing, shipping, and running applications
* AWS (SES, S3),

## Project setup

- create .env.local

```bash
$ npm install

$ npm run migrate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
