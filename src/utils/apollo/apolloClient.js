import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});
