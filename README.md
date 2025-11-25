# NoteVerse Server

A RESTful API server built with **Node.js**, **Express**, and **MongoDB** for managing posts. This server allows you to create, read, update, and delete posts, with optional filtering by author.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [License](#license)

---

## Features

- Create posts (requires `authorId`)
- Retrieve all posts or filter by `authorId`
- Retrieve a single post by ID
- Update posts (authorization via `authorEmail`)
- Delete posts (authorization via `authorEmail`)
- MongoDB connection with robust error handling

---

## Technologies

- Node.js v22
- Express.js
- MongoDB & MongoDB Atlas
- cors
- dotenv

---

## Setup

1. Clone the repository:

```bash
git clone https://github.com/saifurrahmanctg/notevese-nextjs.git
cd noteverse-server
```

2. Install dependencies:

```bash
npm install
```
