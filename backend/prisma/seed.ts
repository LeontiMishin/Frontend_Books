import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const baseTimestamp = new Date("2026-03-17T10:00:00.000Z");

async function main(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Review",
      "_BookToGenre",
      "Book",
      "Genre",
      "Publisher",
      "Author"
    RESTART IDENTITY CASCADE
  `);

  await prisma.author.createMany({
    data: [
      {
        id: 1,
        firstName: "George",
        lastName: "Orwell",
        birthYear: 1903,
        nationality: "British",
        biography: "Known for politically charged fiction and sharp social criticism.",
        createdAt: baseTimestamp
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Austen",
        birthYear: 1775,
        nationality: "British",
        biography: "Classic novelist celebrated for wit, character and social observation.",
        createdAt: baseTimestamp
      },
      {
        id: 3,
        firstName: "Haruki",
        lastName: "Murakami",
        birthYear: 1949,
        nationality: "Japanese",
        biography: "Writer blending realism, loneliness and surreal imagery.",
        createdAt: baseTimestamp
      },
      {
        id: 4,
        firstName: "Chimamanda Ngozi",
        lastName: "Adichie",
        birthYear: 1977,
        nationality: "Nigerian",
        biography: "Acclaimed novelist writing about identity, history and power.",
        createdAt: baseTimestamp
      },
      {
        id: 5,
        firstName: "Jules",
        lastName: "Verne",
        birthYear: 1828,
        nationality: "French",
        biography: "Pioneer of adventure and early science fiction.",
        createdAt: baseTimestamp
      },
      {
        id: 6,
        firstName: "Andrus",
        lastName: "Kivirahk",
        birthYear: 1970,
        nationality: "Estonian",
        biography: "Estonian author known for satire and folklore-inspired novels.",
        createdAt: baseTimestamp
      }
    ]
  });

  await prisma.publisher.createMany({
    data: [
      {
        id: 1,
        name: "Penguin Books",
        country: "United Kingdom",
        foundedYear: 1935,
        website: "https://www.penguin.co.uk",
        createdAt: baseTimestamp
      },
      {
        id: 2,
        name: "Vintage",
        country: "United States",
        foundedYear: 1954,
        website: "https://www.vintagebooks.com",
        createdAt: baseTimestamp
      },
      {
        id: 3,
        name: "Varrak",
        country: "Estonia",
        foundedYear: 1991,
        website: "https://varrak.ee",
        createdAt: baseTimestamp
      },
      {
        id: 4,
        name: "HarperCollins",
        country: "United States",
        foundedYear: 1989,
        website: "https://www.harpercollins.com",
        createdAt: baseTimestamp
      }
    ]
  });

  await prisma.genre.createMany({
    data: [
      { id: 1, name: "Dystopian" },
      { id: 2, name: "Romance" },
      { id: 3, name: "Magical Realism" },
      { id: 4, name: "Historical Fiction" },
      { id: 5, name: "Science Fiction" },
      { id: 6, name: "Satire" }
    ]
  });

  const books = [
    {
      title: "1984",
      isbn: "9780451524935",
      publishedYear: 1949,
      pageCount: 328,
      language: "English",
      description: "A surveillance state crushes freedom and individuality.",
      authorId: 1,
      publisherId: 1,
      genreIds: [1]
    },
    {
      title: "Animal Farm",
      isbn: "9780451526342",
      publishedYear: 1945,
      pageCount: 112,
      language: "English",
      description: "A political fable about revolution, power and corruption.",
      authorId: 1,
      publisherId: 1,
      genreIds: [6]
    },
    {
      title: "Pride and Prejudice",
      isbn: "9780141439518",
      publishedYear: 1813,
      pageCount: 480,
      language: "English",
      description: "An iconic novel of manners, class and love.",
      authorId: 2,
      publisherId: 1,
      genreIds: [2]
    },
    {
      title: "Kafka on the Shore",
      isbn: "9781400079278",
      publishedYear: 2002,
      pageCount: 505,
      language: "Japanese",
      description: "An enigmatic coming-of-age story with surreal threads.",
      authorId: 3,
      publisherId: 2,
      genreIds: [3]
    },
    {
      title: "Norwegian Wood",
      isbn: "9780375704024",
      publishedYear: 1987,
      pageCount: 296,
      language: "Japanese",
      description: "A nostalgic and emotional story of youth and loss.",
      authorId: 3,
      publisherId: 2,
      genreIds: [4]
    },
    {
      title: "Half of a Yellow Sun",
      isbn: "9781400095209",
      publishedYear: 2006,
      pageCount: 448,
      language: "English",
      description: "Lives collide during the Nigerian Civil War.",
      authorId: 4,
      publisherId: 4,
      genreIds: [4]
    },
    {
      title: "Purple Hibiscus",
      isbn: "9781616202415",
      publishedYear: 2003,
      pageCount: 320,
      language: "English",
      description: "A powerful family story shaped by silence and control.",
      authorId: 4,
      publisherId: 4,
      genreIds: [4]
    },
    {
      title: "Journey to the Center of the Earth",
      isbn: "9780486440880",
      publishedYear: 1864,
      pageCount: 240,
      language: "French",
      description: "An expedition descends into a fantastic underground world.",
      authorId: 5,
      publisherId: 1,
      genreIds: [5]
    },
    {
      title: "Twenty Thousand Leagues Under the Seas",
      isbn: "9781503214132",
      publishedYear: 1870,
      pageCount: 426,
      language: "French",
      description: "Captain Nemo and the Nautilus explore the oceans.",
      authorId: 5,
      publisherId: 1,
      genreIds: [5]
    },
    {
      title: "Mees, kes teadis ussisõnu",
      isbn: "9789985337141",
      publishedYear: 2007,
      pageCount: 400,
      language: "Estonian",
      description: "A myth-rich tale about identity, memory and change.",
      coverImage: "https://example.com/ussisonu.jpg",
      authorId: 6,
      publisherId: 3,
      genreIds: [3]
    },
    {
      title: "Rehepapp",
      isbn: "9789985312766",
      publishedYear: 2000,
      pageCount: 304,
      language: "Estonian",
      description: "A darkly comic folk novel full of absurd village life.",
      authorId: 6,
      publisherId: 3,
      genreIds: [6, 3]
    },
    {
      title: "Emma",
      isbn: "9780141439587",
      publishedYear: 1815,
      pageCount: 474,
      language: "English",
      description: "A witty novel about matchmaking and self-discovery.",
      authorId: 2,
      publisherId: 1,
      genreIds: [2]
    }
  ];

  const bookIdByIsbn = new Map<string, number>();

  for (const book of books) {
    const createdBook = await prisma.book.create({
      data: {
        title: book.title,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        pageCount: book.pageCount,
        language: book.language,
        description: book.description,
        coverImage: book.coverImage,
        createdAt: baseTimestamp,
        updatedAt: baseTimestamp,
        author: { connect: { id: book.authorId } },
        publisher: { connect: { id: book.publisherId } },
        genres: { connect: book.genreIds.map((id) => ({ id })) }
      }
    });

    bookIdByIsbn.set(createdBook.isbn, createdBook.id);
  }

  const reviewSeeds = [
    { bookIsbn: "9780451524935", userName: "Anna", rating: 5 as const, comment: "Still frighteningly relevant." },
    { bookIsbn: "9780451524935", userName: "Mark", rating: 4 as const, comment: "Bleak but brilliant." },
    { bookIsbn: "9780451526342", userName: "Sofia", rating: 5 as const, comment: "Short, sharp and memorable." },
    { bookIsbn: "9780141439518", userName: "Liam", rating: 4 as const, comment: "Classic for a reason." },
    { bookIsbn: "9781400079278", userName: "Noah", rating: 5 as const, comment: "Dreamlike and unforgettable." },
    { bookIsbn: "9781400079278", userName: "Eva", rating: 4 as const, comment: "Weird in the best way." },
    { bookIsbn: "9780375704024", userName: "Mia", rating: 4 as const, comment: "Quietly heartbreaking." },
    { bookIsbn: "9781400095209", userName: "Daniel", rating: 5 as const, comment: "Powerful and human." },
    { bookIsbn: "9781616202415", userName: "Helena", rating: 4 as const, comment: "Strong voice and tension." },
    { bookIsbn: "9780486440880", userName: "Karl", rating: 3 as const, comment: "Fun adventure, a little dated." },
    { bookIsbn: "9781503214132", userName: "Grete", rating: 5 as const, comment: "Big imagination and scope." },
    { bookIsbn: "9789985337141", userName: "Rasmus", rating: 5 as const, comment: "Very unique and atmospheric." },
    { bookIsbn: "9789985337141", userName: "Kati", rating: 4 as const, comment: "A memorable Estonian fantasy." },
    { bookIsbn: "9789985312766", userName: "Tanel", rating: 4 as const, comment: "Funny and unsettling." }
  ];

  await prisma.review.createMany({
    data: reviewSeeds.map((review) => {
      const bookId = bookIdByIsbn.get(review.bookIsbn);

      if (!bookId) {
        throw new Error(`Missing seeded book for ISBN ${review.bookIsbn}`);
      }

      return {
        bookId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        createdAt: baseTimestamp
      };
    })
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
