import type { Author, Book, Genre, Publisher, Review } from "../models/entities";

type StoredBook = Book & { deletedAt: Date | null };
type StoredReview = Review & { deletedAt: Date | null };

const baseTimestamp = new Date("2026-03-17T10:00:00.000Z");

export const authors: Author[] = [
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
];

export const publishers: Publisher[] = [
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
];

export const genres: Genre[] = [
  { id: 1, name: "Dystopian" },
  { id: 2, name: "Romance" },
  { id: 3, name: "Magical Realism" },
  { id: 4, name: "Historical Fiction" },
  { id: 5, name: "Science Fiction" },
  { id: 6, name: "Satire" }
];

export const books: StoredBook[] = [
  {
    id: 1,
    title: "1984",
    isbn: "9780451524935",
    publishedYear: 1949,
    pageCount: 328,
    language: "English",
    description: "A surveillance state crushes freedom and individuality.",
    authorId: 1,
    publisherId: 1,
    genres: [1],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 2,
    title: "Animal Farm",
    isbn: "9780451526342",
    publishedYear: 1945,
    pageCount: 112,
    language: "English",
    description: "A political fable about revolution, power and corruption.",
    authorId: 1,
    publisherId: 1,
    genres: [6],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    isbn: "9780141439518",
    publishedYear: 1813,
    pageCount: 480,
    language: "English",
    description: "An iconic novel of manners, class and love.",
    authorId: 2,
    publisherId: 1,
    genres: [2],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 4,
    title: "Kafka on the Shore",
    isbn: "9781400079278",
    publishedYear: 2002,
    pageCount: 505,
    language: "Japanese",
    description: "An enigmatic coming-of-age story with surreal threads.",
    authorId: 3,
    publisherId: 2,
    genres: [3],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 5,
    title: "Norwegian Wood",
    isbn: "9780375704024",
    publishedYear: 1987,
    pageCount: 296,
    language: "Japanese",
    description: "A nostalgic and emotional story of youth and loss.",
    authorId: 3,
    publisherId: 2,
    genres: [4],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 6,
    title: "Half of a Yellow Sun",
    isbn: "9781400095209",
    publishedYear: 2006,
    pageCount: 448,
    language: "English",
    description: "Lives collide during the Nigerian Civil War.",
    authorId: 4,
    publisherId: 4,
    genres: [4],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 7,
    title: "Purple Hibiscus",
    isbn: "9781616202415",
    publishedYear: 2003,
    pageCount: 320,
    language: "English",
    description: "A powerful family story shaped by silence and control.",
    authorId: 4,
    publisherId: 4,
    genres: [4],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 8,
    title: "Journey to the Center of the Earth",
    isbn: "9780486440880",
    publishedYear: 1864,
    pageCount: 240,
    language: "French",
    description: "An expedition descends into a fantastic underground world.",
    authorId: 5,
    publisherId: 1,
    genres: [5],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 9,
    title: "Twenty Thousand Leagues Under the Seas",
    isbn: "9781503214132",
    publishedYear: 1870,
    pageCount: 426,
    language: "French",
    description: "Captain Nemo and the Nautilus explore the oceans.",
    authorId: 5,
    publisherId: 1,
    genres: [5],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 10,
    title: "Mees, kes teadis ussisõnu",
    isbn: "9789985337141",
    publishedYear: 2007,
    pageCount: 400,
    language: "Estonian",
    description: "A myth-rich tale about identity, memory and change.",
    coverImage: "https://example.com/ussisonu.jpg",
    authorId: 6,
    publisherId: 3,
    genres: [3],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 11,
    title: "Rehepapp",
    isbn: "9789985312766",
    publishedYear: 2000,
    pageCount: 304,
    language: "Estonian",
    description: "A darkly comic folk novel full of absurd village life.",
    authorId: 6,
    publisherId: 3,
    genres: [6, 3],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  },
  {
    id: 12,
    title: "Emma",
    isbn: "9780141439587",
    publishedYear: 1815,
    pageCount: 474,
    language: "English",
    description: "A witty novel about matchmaking and self-discovery.",
    authorId: 2,
    publisherId: 1,
    genres: [2],
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    deletedAt: null
  }
];

export const reviews: StoredReview[] = [
  { id: 1, bookId: 1, userName: "Anna", rating: 5, comment: "Still frighteningly relevant.", createdAt: baseTimestamp, deletedAt: null },
  { id: 2, bookId: 1, userName: "Mark", rating: 4, comment: "Bleak but brilliant.", createdAt: baseTimestamp, deletedAt: null },
  { id: 3, bookId: 2, userName: "Sofia", rating: 5, comment: "Short, sharp and memorable.", createdAt: baseTimestamp, deletedAt: null },
  { id: 4, bookId: 3, userName: "Liam", rating: 4, comment: "Classic for a reason.", createdAt: baseTimestamp, deletedAt: null },
  { id: 5, bookId: 4, userName: "Noah", rating: 5, comment: "Dreamlike and unforgettable.", createdAt: baseTimestamp, deletedAt: null },
  { id: 6, bookId: 4, userName: "Eva", rating: 4, comment: "Weird in the best way.", createdAt: baseTimestamp, deletedAt: null },
  { id: 7, bookId: 5, userName: "Mia", rating: 4, comment: "Quietly heartbreaking.", createdAt: baseTimestamp, deletedAt: null },
  { id: 8, bookId: 6, userName: "Daniel", rating: 5, comment: "Powerful and human.", createdAt: baseTimestamp, deletedAt: null },
  { id: 9, bookId: 7, userName: "Helena", rating: 4, comment: "Strong voice and tension.", createdAt: baseTimestamp, deletedAt: null },
  { id: 10, bookId: 8, userName: "Karl", rating: 3, comment: "Fun adventure, a little dated.", createdAt: baseTimestamp, deletedAt: null },
  { id: 11, bookId: 9, userName: "Grete", rating: 5, comment: "Big imagination and scope.", createdAt: baseTimestamp, deletedAt: null },
  { id: 12, bookId: 10, userName: "Rasmus", rating: 5, comment: "Very unique and atmospheric.", createdAt: baseTimestamp, deletedAt: null },
  { id: 13, bookId: 10, userName: "Kati", rating: 4, comment: "A memorable Estonian fantasy.", createdAt: baseTimestamp, deletedAt: null },
  { id: 14, bookId: 11, userName: "Tanel", rating: 4, comment: "Funny and unsettling.", createdAt: baseTimestamp, deletedAt: null }
];
