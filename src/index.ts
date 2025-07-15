import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import z from 'zod'
import { db } from './db.js'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors({
  origin: '*'
}))


app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Retrieve all books with pagination
app.get("/books",
  zValidator("query", z.object({
    skip: z.string().transform(s => parseInt(s)),
    limit: z.string().transform(s => parseInt(s))
  })),
  async (c) => {
    const { skip, limit } = c.req.valid('query')
    const data = await db.book.findMany({
      skip,
      take: limit,
    })
    return c.json({ data }, 200)
  })

// Retrieve a specific book
app.get("/books/:id",
  zValidator("param", z.object({
    id: z.string()
  })),
  async (c) => {
    const { id } = c.req.valid('param')
    const data = await db.book.findUnique({
      where: { id },

    })
    return c.json({ data }, 200)
  })

// Add a new book (ADMIN Only)
app.post("/books",
  zValidator("json", z.object({
    name: z.string(),
    description: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    userId: z.string()
  })),
  async (c) => {
    const { name, description, author, tags, userId } = c.req.valid('json')
    const user = await db.user.findUnique({ where: { id: userId } })
    if (user?.role !== 'ADMIN') return c.json({ error: 'Unauthorized' }, 401);

    const data = await db.book.create({
      data: { name, description, author, tags, userId }
    })
    return c.json({ data }, 200)
  })

// Get reviews for a book
app.get("/reviews/:bookId",
  zValidator("param", z.object({
    bookId: z.string()
  })),
  async (c) => {
    const { bookId } = c.req.valid('param')
    const data = await db.review.findMany({ where: { bookId } })
    return c.json({ data }, 200)
  })

// Submit a new review
app.post("/reviews",
  zValidator("json", z.object({ data: z.string(), userId: z.string(), bookId: z.string() })),
  async (c) => {
    const { data, userId, bookId } = c.req.valid('json')
    const review = await db.review.create({
      data: {
        data,
        userId,
        bookId
      }
    })
    return c.json({ review }, 200)
  })

// Get user
app.get("/users/:userId",
  zValidator("param", z.object({
    userId: z.string()
  })),

  async (c) => {
    const { userId } = c.req.valid('param')
    return c.json({ data: await db.user.findUnique({ where: { id: userId } }) }, 200)
  }
)

// Create/Update user
app.put("/users/:userId",
  zValidator("param", z.object({ userId: z.string() })),
  zValidator("json", z.object({
    username: z.string(),
    role: z.enum(['ADMIN', 'USER'])
  })),
  async (c) => {
    const { userId } = c.req.valid('param')
    const { username, role } = c.req.valid('json')

    const user = await db.user.upsert({
      where: { id: userId },
      update: { username, role },
      create: {
        username,
        role
      }
    })

    return c.json({ data: user }, 200)
  })

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
