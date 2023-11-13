import { ApolloLink, InMemoryCache, ApolloClient } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { decryptData } from "../dataEncryption";
import { onError } from "@apollo/client/link/error";

const httpLink = createUploadLink({
  uri: "http://localhost:3001/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = decryptData("token");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation }) => {}),
    authMiddleware,
    httpLink,
  ]),
});
