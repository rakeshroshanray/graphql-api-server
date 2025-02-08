const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const authors = [
    { id: 1, name: "Rakesh Roshan" },
    { id: 2, name: "Rajesh Roshan" },
    { id: 3, name: "Krishna Ray" },
    { id: 4, name: "Mamta Ray" }
];

const books = [
    { id: 1, name: "Rakesh's 1st Book", authorId: 1 },
    { id: 2, name: "Rakesh's 2nd Book", authorId: 1 },
    { id: 3, name: "Rajesh's 1st Book", authorId: 2 },
    { id: 4, name: "Rajesh's 2nd Book", authorId: 2 },
    { id: 5, name: "Rajesh's 3rd Book", authorId: 2 },
    { id: 6, name: "Krishna's 1st Book", authorId: 3 },
    { id: 7, name: "Krishna's 2nd Book", authorId: 3 },
    { id: 8, name: "Mamta's 1st Book", authorId: 4 }
];

// Schema
const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    books: [Book]
  }

  type Book {
    id: ID!
    name: String!
    author: Author
  }

  type Query {
    authors: [Author]
    books: [Book]
    author(id: ID!): Author
    book(id: ID!): Book
  }

  type Mutation {
    addAuthor(name: String!): Author
    addBook(name: String!, authorId: ID!): Book
    updateAuthor(id: ID!, name: String!): Author
    updateBook(id: ID!, name: String!, authorId: ID!): Book
    deleteAuthor(id: ID!): Author
    deleteBook(id: ID!): Book
  }
`;

// Resolvers
const resolvers = {
    Query: {
        authors: () => authors,
        books: () => books,
        author: (_, { id }) => authors.find(author => author.id === Number(id)),
        book: (_, { id }) => books.find(book => book.id === Number(id))
    },
    Mutation: {
        addAuthor: (_, { name }) => {
            const newAuthor = { id: authors.length + 1, name };
            authors.push(newAuthor);
            return newAuthor;
        }, 
        addBook: (_, { name, authorId }) => {
            const book = { id: books.length + 1, name, authorId: Number(authorId) };
            books.push(book);
            return book;
        },
        updateAuthor: (_, { id, name }) => {
            const author = authors.find(author => author.id === Number(id));
            if (author) {
                author.name = name;
                return author;
            }
            return null;
        },
        updateBook: (_, { id, name, authorId }) => {
            const book = books.find(book => book.id === Number(id));
            if (book) {
                book.name = name;
                book.authorId = Number(authorId);
                return book;
            }
            return null;
        },
        deleteAuthor: (_, { id }) => {
            const authorIndex = authors.findIndex(author => author.id === Number(id));
            if (authorIndex > -1) {
                const deletedAuthor = authors.splice(authorIndex, 1)[0];
                return deletedAuthor;
            }
            return null;
        },
        deleteBook: (_, { id }) => {
            const index = books.findIndex(book => book.id === Number(id));
            if (index > -1) {
                const deletedBook = books.splice(index, 1)[0];
                return deletedBook;
            }
            return null;
        }
    },
    Book: {
        author: (book) => authors.find(author => author.id === Number(book.authorId))
    },
    Author: {
        books: (author) => books.filter(book => book.authorId === Number(author.id))
    }
};

async function startServer() {
    const app = express();
    const server = new ApolloServer({ typeDefs, resolvers });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(5000, () => {
        console.log("🚀 Server running at http://localhost:5000/graphql");
    });
}

startServer();
