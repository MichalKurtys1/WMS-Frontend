import React from "react";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/apollo/apolloClient";
import { Provider } from "react-redux";
import store from "./context";
import ReactDOM from "react-dom";

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
