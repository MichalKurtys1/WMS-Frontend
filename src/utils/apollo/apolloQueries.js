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
      bank
      accountNumber
      nip
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
      supplier {
        id
        name
        phone
        email
        city
        street
        number
        bank
        accountNumber
        nip
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
      expectedDate
      totalPrice
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
      orderID
      date
      expectedDate
      products
      state
      transportType
      totalPrice
    }
  }
`;

export const GET_STOCKS = gql`
  query Query {
    stocks {
      id
      productId
      code
      totalQuantity
      availableStock
      ordered
      preOrdered
      product {
        id
        supplierId
        name
        type
        capacity
        unit
        pricePerUnit
        supplier {
          id
          name
        }
      }
    }
  }
`;

export const GET_SHIPMENTS = gql`
  query Query {
    shipments {
      id
      employee
      registrationNumber
      deliveryDate
      orders
      pickingList
      waybill
      state
    }
  }
`;

export const GET_FILES = gql`
  query Query {
    files {
      id
      name
      filename
      date
      category
      subcategory
    }
  }
`;

export const GET_CALENDAR = gql`
  query Query {
    calendar {
      id
      date
      time
      event
    }
  }
`;
