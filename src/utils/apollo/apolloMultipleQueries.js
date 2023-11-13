import { gql } from "apollo-boost";

export const GET_CALENDAR_DATA = gql`
  query Query {
    calendar {
      id
      date
      time
      event
    }
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
    deliveries {
      id
      supplierId
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
      date
      expectedDate
      products
      state
      totalPrice
    }
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

export const GET_GENERAL_RAPORTS = gql`
  query Query {
    generalRaports {
      weekData
      monthData
      yearData
    }
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
          name
        }
      }
    }
  }
`;

export const GET_DELIVERIES_RAPORTS = gql`
  query Query {
    deliveriesRaport {
      weekData
      monthData
      yearData
    }
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

export const GET_ORDERS_RAPORTS = gql`
  query Query {
    ordersRaport {
      weekData
      monthData
      yearData
    }
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

export const GET_STOCK_RAPORTS = gql`
  query Query {
    stockRaport {
      generalData
      operationsData
      weekData
      monthData
      yearData
    }
  }
`;

export const GET_FORMATED_CALENDAR = gql`
  query Query {
    formatedCalendar {
      standardData
      carrierData
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query Query {
    formatedCalendar {
      standardData
      carrierData
    }
    dashboardReport {
      dashboardData
    }
    stocks {
      id
      productId
      code
      totalQuantity
      availableStock
      ordered
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
      preOrdered
    }
  }
`;

export const GET_PRODUCTS_SUPPLIERS = gql`
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

export const GET_ORDERS_STOCK = gql`
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
    stocks {
      id
      productId
      code
      totalQuantity
      availableStock
      ordered
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
      preOrdered
    }
  }
`;

export const GET_CLIENTS_STOCK_PRODUCTS = gql`
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
    stocks {
      id
      productId
      code
      totalQuantity
      availableStock
      ordered
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
      preOrdered
    }
  }
`;

export const GET_EMPLOYYES_ORDERS_STOCK_SHIPMENTS = gql`
  query Query {
    users {
      id
      email
      password
      firstname
      lastname
      phone
      position
      adres
      token
      firstLogin
    }
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
    stocks {
      id
      productId
      code
      totalQuantity
      availableStock
      ordered
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
      preOrdered
    }
  }
`;

export const GET_ORDERS_SHIPMENTS = gql`
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
