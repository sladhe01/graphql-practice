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
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID!): Boolean!
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
