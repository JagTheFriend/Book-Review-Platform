
import { PrismaClient, USER_ROLE } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  console.log("🧹 Clearing existing data...")
  await prisma.review.deleteMany()
  await prisma.book.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  console.log("👥 Creating users...")
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "admin_alice",
        role: USER_ROLE.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        username: "bookworm_bob",
        role: USER_ROLE.USER,
      },
    }),
    prisma.user.create({
      data: {
        username: "reader_carol",
        role: USER_ROLE.USER,
      },
    }),
    prisma.user.create({
      data: {
        username: "critic_dave",
        role: USER_ROLE.USER,
      },
    }),
    prisma.user.create({
      data: {
        username: "author_eve",
        role: USER_ROLE.USER,
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create Books
  console.log("📚 Creating books...")
  const books = await Promise.all([
    prisma.book.create({
      data: {
        name: "The Great Gatsby",
        description:
          "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        author: "F. Scott Fitzgerald",
        tags: ["classic", "american literature", "jazz age", "romance", "tragedy"],
        userId: users[0].id, // admin_alice
      },
    }),
    prisma.book.create({
      data: {
        name: "To Kill a Mockingbird",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        author: "Harper Lee",
        tags: ["classic", "social justice", "coming of age", "american south", "legal drama"],
        userId: users[1].id, // bookworm_bob
      },
    }),
    prisma.book.create({
      data: {
        name: "1984",
        description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
        author: "George Orwell",
        tags: ["dystopian", "science fiction", "political", "surveillance", "totalitarianism"],
        userId: users[1].id, // bookworm_bob
      },
    }),
    prisma.book.create({
      data: {
        name: "Pride and Prejudice",
        description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
        author: "Jane Austen",
        tags: ["romance", "classic", "british literature", "social commentary", "regency era"],
        userId: users[2].id, // reader_carol
      },
    }),
    prisma.book.create({
      data: {
        name: "The Catcher in the Rye",
        description: "A controversial novel about teenage rebellion and alienation in post-war America.",
        author: "J.D. Salinger",
        tags: ["coming of age", "american literature", "teenage angst", "controversial", "modern classic"],
        userId: users[2].id, // reader_carol
      },
    }),
    prisma.book.create({
      data: {
        name: "Dune",
        description: "An epic science fiction novel set in a distant future amidst a feudal interstellar society.",
        author: "Frank Herbert",
        tags: ["science fiction", "epic", "space opera", "politics", "ecology"],
        userId: users[4].id, // author_eve
      },
    }),
    prisma.book.create({
      data: {
        name: "The Lord of the Rings",
        description: "An epic high fantasy novel following the quest to destroy the One Ring.",
        author: "J.R.R. Tolkien",
        tags: ["fantasy", "epic", "adventure", "mythology", "good vs evil"],
        userId: users[4].id, // author_eve
      },
    }),
    prisma.book.create({
      data: {
        name: "Brave New World",
        description: "A dystopian novel exploring a technologically advanced future society.",
        author: "Aldous Huxley",
        tags: ["dystopian", "science fiction", "technology", "society", "philosophy"],
        userId: users[0].id, // admin_alice
      },
    }),
  ])

  console.log(`✅ Created ${books.length} books`)

  // Create Reviews
  console.log("⭐ Creating reviews...")
  const reviews = await Promise.all([
    // Reviews for The Great Gatsby
    prisma.review.create({
      data: {
        data: "A masterpiece of American literature. Fitzgerald's prose is absolutely beautiful and the themes are timeless. The symbolism of the green light still gives me chills.",
        userId: users[1].id, // bookworm_bob
        bookId: books[0].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "Overrated in my opinion. The characters are all unlikeable and the plot drags. I understand its literary significance but it didn't resonate with me personally.",
        userId: users[3].id, // critic_dave
        bookId: books[0].id,
      },
    }),

    // Reviews for To Kill a Mockingbird
    prisma.review.create({
      data: {
        data: "An essential read that tackles difficult subjects with grace and wisdom. Scout's perspective makes complex social issues accessible and deeply moving.",
        userId: users[2].id, // reader_carol
        bookId: books[1].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "Harper Lee created something truly special here. The courtroom scenes are intense and the character development is phenomenal. A book that stays with you.",
        userId: users[4].id, // author_eve
        bookId: books[1].id,
      },
    }),

    // Reviews for 1984
    prisma.review.create({
      data: {
        data: "Terrifyingly relevant today. Orwell's vision of surveillance and thought control feels prophetic. Big Brother is watching, indeed.",
        userId: users[0].id, // admin_alice
        bookId: books[2].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "A chilling dystopia that makes you appreciate freedom. The concept of doublethink is brilliantly executed. Required reading for understanding totalitarianism.",
        userId: users[3].id, // critic_dave
        bookId: books[2].id,
      },
    }),

    // Reviews for Pride and Prejudice
    prisma.review.create({
      data: {
        data: "Jane Austen's wit and social commentary are unmatched. Elizabeth Bennet is one of literature's greatest heroines. The romance is perfectly crafted.",
        userId: users[1].id, // bookworm_bob
        bookId: books[3].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "A delightful read with sharp observations about society and human nature. The dialogue sparkles with intelligence and humor.",
        userId: users[4].id, // author_eve
        bookId: books[3].id,
      },
    }),

    // Reviews for The Catcher in the Rye
    prisma.review.create({
      data: {
        data: "Holden Caulfield is the perfect representation of teenage angst and alienation. Salinger captures the voice of youth struggling with an adult world.",
        userId: users[0].id, // admin_alice
        bookId: books[4].id,
      },
    }),

    // Reviews for Dune
    prisma.review.create({
      data: {
        data: "An incredible world-building achievement. Herbert created a complex universe with deep political and ecological themes. The spice must flow!",
        userId: users[1].id, // bookworm_bob
        bookId: books[5].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "Dense but rewarding. The political intrigue and desert setting create an immersive experience. Paul's journey is compelling and complex.",
        userId: users[2].id, // reader_carol
        bookId: books[5].id,
      },
    }),

    // Reviews for The Lord of the Rings
    prisma.review.create({
      data: {
        data: "The gold standard of fantasy literature. Tolkien's world-building is unparalleled and the themes of friendship and sacrifice are deeply moving.",
        userId: users[3].id, // critic_dave
        bookId: books[6].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "An epic adventure that defined the fantasy genre. The fellowship's journey is both thrilling and emotionally resonant. A true masterpiece.",
        userId: users[0].id, // admin_alice
        bookId: books[6].id,
      },
    }),

    // Reviews for Brave New World
    prisma.review.create({
      data: {
        data: "Huxley's vision of a pleasure-seeking society is both fascinating and disturbing. The contrast with 1984 makes for interesting philosophical discussions.",
        userId: users[2].id, // reader_carol
        bookId: books[7].id,
      },
    }),
    prisma.review.create({
      data: {
        data: "A thought-provoking exploration of happiness versus freedom. The soma-dependent society feels uncomfortably plausible in our modern world.",
        userId: users[4].id, // author_eve
        bookId: books[7].id,
      },
    }),
  ])

  console.log(`✅ Created ${reviews.length} reviews`)

  // Display summary
  console.log("\n📊 Seeding Summary:")
  console.log(`👥 Users: ${users.length}`)
  console.log(`📚 Books: ${books.length}`)
  console.log(`⭐ Reviews: ${reviews.length}`)

  console.log("\n🎉 Database seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
