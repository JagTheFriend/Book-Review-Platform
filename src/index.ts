import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Retrieve all books with pagination
app.get("/books", async (c) => { })

// Retrieve a specific book
app.get("/books/:id", async (c) => { })

// Add a new book (ADMIN Only)
app.post("/books", async (c) => { })

// Get reviews for a book
app.get("/reviews", async (c) => { })

// Submit a new review
app.post("/reviews", async (c) => { })

// Get user
app.get("/users/:userId", async (c) => { })

// Update user
app.put("/users/:userId", async (c) => { })

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
