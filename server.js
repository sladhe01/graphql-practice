import { ApolloServer, gql } from "apollo-server";

/* fake list */
let tweets = [
  { id: "1", text: "first", userId: "2" },
  { id: "2", text: "second", userId: "1" },
];

let users = [
  { id: "1", firstName: "j", lastName: "z" },
  { id: "2", firstName: "k", lastName: "w" },
];

const typeDefs = gql`
  """
  User object represents a resource for a User
  """
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int
    url: String
    imdb_code: String
    title: String
    title_english: String
    title_long: String
    slug: String
    year: Int
    rating: Float
    runtime: Float
    genres: [String]
    summary: String
    description_full: String
    synopsis: String
    yt_trailer_code: String
    language: String
    background_image: String
    background_image_original: String
    small_cover_image: String
    medium_cover_image: String
    large_cover_image: String
  }
`;
const resolvers = {
  Query: {
    allUsers() {
      console.log("allUsers called");
      return users;
    },
    allTweets() {
      return tweets;
    },
    tweet(_, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = { id: tweets.length + 1, text, userId };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName({ firstName, lastName }) {
      return firstName + lastName;
    },
  },
  Tweet: {
    author({ userId }) {
      const user = users.find((user) => user.id === userId);
      if (!user) return null;
      return user;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
