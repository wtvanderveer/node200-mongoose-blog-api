# My Blog API

A blog REST API built with Node.js, Express, and Mongoose (MongoDB). Users (authors) can write blog posts, and posts can be marked as featured. A simple front end in `public/` lets you add authors and publish posts from the browser.

## Requirements

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port 27017, or a hosted database such as MongoDB Atlas

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:3000.

### Configuration

| Variable      | Default                       | Description               |
| ------------- | ----------------------------- | ------------------------- |
| `MONGODB_URI` | `mongodb://localhost/my-blog` | MongoDB connection string |
| `PORT`        | `3000`                        | Port the server runs on   |

## API

### Users — `/api/users`

| Method | Route            | Description            |
| ------ | ---------------- | ---------------------- |
| GET    | `/api/users`     | List all users         |
| GET    | `/api/users/:id` | Get one user           |
| POST   | `/api/users`     | Create a user          |
| PUT    | `/api/users/:id` | Update a user          |
| DELETE | `/api/users/:id` | Delete a user          |

Example body:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@gmail.com",
  "social": {
    "twitter": "@johnsmith",
    "linkedIn": "https://www.linkedin.com/in/johnsmith",
    "facebook": "john.smith"
  }
}
```

`firstName`, `lastName`, and `email` are required.

### Blogs — `/api/blogs`

| Method | Route                | Description                           |
| ------ | -------------------- | ------------------------------------- |
| GET    | `/api/blogs`         | List all blogs                        |
| GET    | `/api/blogs/featured`| List featured blogs only              |
| GET    | `/api/blogs/:id`     | Get one blog                          |
| POST   | `/api/blogs`         | Create a blog (adds it to the author) |
| PUT    | `/api/blogs/:id`     | Update a blog                         |
| DELETE | `/api/blogs/:id`     | Delete a blog (removes it from the author) |

Example body:

```json
{
  "title": "Hello World",
  "article": "My first post.",
  "published": "2026-11-03",
  "featured": true,
  "author": "<user id>"
}
```

All fields are required, and `author` must be the ID of an existing user.

## Tests

With MongoDB running:

```bash
npm test
```

The tests use the same database as the app, so their sample data will show up in it.

## Project structure

```
server/
  app.js          Express app and MongoDB connection
  index.js        Starts the server
  models/         Mongoose models (User, Blog)
  routes/         API routes (users, blogs)
public/           Front end (HTML, CSS, JS)
test/             Mocha/Chai tests
```
