import { gql } from "apollo-boost";

// get all

export const GET_EMPLOYYES = gql`
  query Query {
    users {
      id
      email
      password
      firstname
      lastname
      phone
      magazine
      position
      token
      firstLogin
    }
  }
`;

export const GET_CLIENTS = gql`
  query Query {
    clients {
      id
      name
      phone
      email
      city
      street
      number
      nip
    }
  }
`;

export const GET_SUPPLIERS = gql`
  query Query {
    suppliers {
      id
      name
      phone
      email
      city
      street
      number
    }
  }
`;

export const GET_PRODUCTS = gql`
  query Query {
    products {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
      availableStock
      supplier {
        id
        name
        phone
        email
        city
        street
        number
      }
    }
  }
`;

export const GET_DELIVERIES = gql`
  query Query {
    deliveries {
      id
      supplierId
      date
      warehouse
      comments
      products
      state
      supplier {
        id
        name
        phone
        email
        city
        street
        number
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query Query {
    orders {
      id
      clientId
      client {
        id
        name
        phone
        email
        city
        street
        number
        nip
      }
      date
      warehouse
      comments
      products
      state
    }
  }
`;

export const GET_OPERATIONS = gql`
  query Query {
    operations {
      id
      deliveriesId
      ordersId
      stage
      data
      delivery {
        id
        supplierId
        date
        warehouse
        comments
        products
        state
      }
      order {
        id
        clientId
        date
        warehouse
        comments
        products
        state
      }
    }
  }
`;

export const GET_LOCATIONS = gql`
  query Query {
    locations {
      product {
        name
        type
        capacity
        unit
      }
      numberOfProducts
      posX
      posY
    }
  }
`;
