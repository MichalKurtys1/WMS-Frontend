import { gql } from "apollo-boost";

// delete

export const DELETE_EMPLOYYE = gql`
  mutation Mutation($deleteUserId: String!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const DELETE_CLIENT = gql`
  mutation Mutation($deleteClientId: String!) {
    deleteClient(id: $deleteClientId)
  }
`;

export const DELETE_SUPPLIER = gql`
  mutation Mutation($deleteSupplierId: String!) {
    deleteSupplier(id: $deleteSupplierId)
  }
`;

export const DELETE_PRODUCT = gql`
  mutation Mutation($deleteProductId: String!) {
    deleteProduct(id: $deleteProductId)
  }
`;

export const DELETE_DELIVERY = gql`
  mutation Mutation($deleteDeliveryId: String!) {
    deleteDelivery(id: $deleteDeliveryId)
  }
`;

export const DELETE_ORDER = gql`
  mutation Mutation($deleteOrderId: String!) {
    deleteOrder(id: $deleteOrderId)
  }
`;

export const DELETE_TRANSFER = gql`
  mutation Mutation($deleteTransferId: String!) {
    deleteTransfer(id: $deleteTransferId)
  }
`;

// add

export const ADD_EMPLOYEE = gql`
  mutation Mutation(
    $email: String!
    $firstname: String!
    $lastname: String!
    $phone: String!
    $position: String!
    $adres: String!
  ) {
    createUser(
      email: $email
      firstname: $firstname
      lastname: $lastname
      phone: $phone
      position: $position
      adres: $adres
    ) {
      id
      email
      firstname
      lastname
      phone
      position
      adres
    }
  }
`;

export const ADD_CLIENT = gql`
  mutation Mutation(
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
    $nip: String
  ) {
    createClient(
      name: $name
      phone: $phone
      email: $email
      city: $city
      street: $street
      number: $number
      nip: $nip
    ) {
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

export const ADD_SUPPLIER = gql`
  mutation Mutation(
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
    $bank: String!
    $accountNumber: String!
    $nip: String!
  ) {
    createSupplier(
      name: $name
      phone: $phone
      email: $email
      city: $city
      street: $street
      number: $number
      bank: $bank
      accountNumber: $accountNumber
      nip: $nip
    ) {
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

export const ADD_PRODUCT = gql`
  mutation Mutation(
    $supplierId: ID!
    $name: String!
    $type: String!
    $capacity: String!
    $unit: String!
    $pricePerUnit: Float!
  ) {
    createProduct(
      supplierId: $supplierId
      name: $name
      type: $type
      capacity: $capacity
      unit: $unit
      pricePerUnit: $pricePerUnit
    ) {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
    }
  }
`;

export const ADD_DELIVERY = gql`
  mutation Mutation(
    $supplierId: ID!
    $expectedDate: String!
    $products: JSON!
    $totalPrice: Float!
  ) {
    createDelivery(
      supplierId: $supplierId
      expectedDate: $expectedDate
      products: $products
      totalPrice: $totalPrice
    ) {
      id
      supplierId
      date
      expectedDate
      products
      state
      totalPrice
    }
  }
`;

export const ADD_ORDER = gql`
  mutation Mutation(
    $clientId: ID!
    $expectedDate: String!
    $products: JSON!
    $totalPrice: Float!
  ) {
    createOrder(
      clientId: $clientId
      expectedDate: $expectedDate
      products: $products
      totalPrice: $totalPrice
    ) {
      id
      clientId
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

export const ADD_OPERATION = gql`
  mutation Mutation($transfersId: ID, $ordersId: ID, $deliveriesId: ID) {
    createOperation(
      transfersId: $transfersId
      ordersId: $ordersId
      deliveriesId: $deliveriesId
    ) {
      id
      deliveriesId
      ordersId
      transferId
      stage
      data
    }
  }
`;

export const ADD_LOCATION = gql`
  mutation Mutation(
    $operationId: ID!
    $productId: ID!
    $numberOfProducts: Float!
    $posX: String!
    $posY: String!
  ) {
    createLocation(
      operationId: $operationId
      productId: $productId
      numberOfProducts: $numberOfProducts
      posX: $posX
      posY: $posY
    ) {
      id
      productId
      numberOfProducts
      posX
      posY
      product {
        id
        supplierId
        name
        type
        capacity
        unit
        pricePerUnit
        availableStock
      }
    }
  }
`;

export const ADD_TRANSFER = gql`
  mutation Mutation($employee: String!, $date: String!, $data: JSON!) {
    createTransfer(employee: $employee, date: $date, data: $data) {
      id
      employee
      date
      data
      state
    }
  }
`;

export const ADD_SHIPPING = gql`
  mutation Mutation(
    $orderId: ID!
    $totalWeight: String!
    $palletSize: String!
    $palletNumber: String!
    $products: JSON!
  ) {
    createShipping(
      orderId: $orderId
      totalWeight: $totalWeight
      palletSize: $palletSize
      palletNumber: $palletNumber
      products: $products
    ) {
      id
      orderId
      totalWeight
      palletSize
      palletNumber
      products
    }
  }
`;

export const ADD_ORDERS_SHIPMENT = gql`
  mutation Mutation(
    $employee: String!
    $registrationNumber: String!
    $deliveryDate: String!
    $orders: JSON!
    $pickingList: JSON!
  ) {
    createOrderShipment(
      employee: $employee
      registrationNumber: $registrationNumber
      deliveryDate: $deliveryDate
      orders: $orders
      pickingList: $pickingList
    ) {
      id
      employee
      registrationNumber
      deliveryDate
      orders
      state
      pickingList
    }
  }
`;

// get one

export const GET_CLIENT = gql`
  mutation Mutation($getClientId: String!) {
    getClient(id: $getClientId) {
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

export const GET_EMPLOYEE = gql`
  mutation Mutation($getUserId: String!) {
    getUser(id: $getUserId) {
      id
      email
      firstname
      lastname
      phone
      position
      adres
    }
  }
`;

export const GET_SUPPLIER = gql`
  mutation Mutation($getSupplierId: String!) {
    getSupplier(id: $getSupplierId) {
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

export const GET_PRODUCT = gql`
  mutation Mutation($getProductId: String!) {
    getProduct(id: $getProductId) {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
    }
  }
`;

export const GET_DELIVERY = gql`
  mutation Mutation($getDeliveryId: String!) {
    getDelivery(id: $getDeliveryId) {
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
    }
  }
`;

export const GET_ORDER = gql`
  mutation Mutation($getOrderId: String!) {
    getOrder(id: $getOrderId) {
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
      expectedDate
      products
      state
      transportType
    }
  }
`;

// update

export const UPDATE_CLIENT = gql`
  mutation Mutation(
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
    $nip: String
    $updateClientId: String!
  ) {
    updateClient(
      name: $name
      phone: $phone
      email: $email
      city: $city
      street: $street
      number: $number
      nip: $nip
      id: $updateClientId
    ) {
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

export const UPDATE_EMPLOYEE = gql`
  mutation Mutation(
    $updateUserId: String!
    $email: String!
    $firstname: String!
    $lastname: String!
    $phone: String!
    $position: String!
    $adres: String!
  ) {
    updateUser(
      id: $updateUserId
      email: $email
      firstname: $firstname
      lastname: $lastname
      phone: $phone
      position: $position
      adres: $adres
    ) {
      id
      email
      firstname
      lastname
      phone
      position
      adres
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation Mutation(
    $updateSupplierId: String!
    $name: String!
    $phone: String!
    $email: String!
    $city: String!
    $street: String!
    $number: String!
    $bank: String!
    $accountNumber: String!
    $nip: String!
  ) {
    updateSupplier(
      id: $updateSupplierId
      name: $name
      phone: $phone
      email: $email
      city: $city
      street: $street
      number: $number
      bank: $bank
      accountNumber: $accountNumber
      nip: $nip
    ) {
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

export const UPDATE_PRODUCT = gql`
  mutation Mutation(
    $updateProductId: String!
    $supplierId: ID!
    $name: String!
    $type: String!
    $capacity: String!
    $unit: String!
    $pricePerUnit: Float!
  ) {
    updateProduct(
      id: $updateProductId
      supplierId: $supplierId
      name: $name
      type: $type
      capacity: $capacity
      unit: $unit
      pricePerUnit: $pricePerUnit
    ) {
      id
      supplierId
      name
      type
      capacity
      unit
      pricePerUnit
    }
  }
`;

export const UPDATE_DELIVERY = gql`
  mutation Mutation(
    $updateDeliveryId: ID!
    $supplierId: ID!
    $expectedDate: String!
    $products: JSON!
    $totalPrice: Float!
  ) {
    updateDelivery(
      id: $updateDeliveryId
      supplierId: $supplierId
      expectedDate: $expectedDate
      products: $products
      totalPrice: $totalPrice
    ) {
      id
      supplierId
      date
      expectedDate
      products
      state
      totalPrice
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation Mutation(
    $updateOrderId: ID!
    $clientId: ID!
    $expectedDate: String!
    $products: JSON!
    $totalPrice: Float!
  ) {
    updateOrder(
      id: $updateOrderId
      clientId: $clientId
      expectedDate: $expectedDate
      products: $products
      totalPrice: $totalPrice
    ) {
      id
      clientId
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

export const UPDATE_AVAILABLE_STOCK = gql`
  mutation Mutation($updateAvailableStockId: String!, $availableStock: Float!) {
    updateAvailableStock(
      id: $updateAvailableStockId
      availableStock: $availableStock
    )
  }
`;

export const UPDATE_OPERATION = gql`
  mutation Mutation($operationId: ID!, $data: JSON!, $stage: Float!) {
    updateOperation(operationId: $operationId, data: $data, stage: $stage) {
      id
      deliveriesId
      stage
      data
    }
  }
`;

export const UPDATE_DELIVERY_STATE = gql`
  mutation Mutation($updateStateId: String!, $state: String!) {
    updateState(id: $updateStateId, state: $state) {
      id
      supplierId
      date
      expectedDate
      products
      state
    }
  }
`;

export const UPDATE_DELIVERY_VALUES = gql`
  mutation Mutation($updateValuesId: String!, $products: JSON!) {
    updateValues(id: $updateValuesId, products: $products) {
      id
      supplierId
      date
      expectedDate
      products
      state
    }
  }
`;

export const UPDATE_STOCK = gql`
  mutation Mutation(
    $updateStockId: String!
    $productId: ID
    $totalQuantity: Float
    $availableStock: Float
    $ordered: Float
  ) {
    updateStock(
      id: $updateStockId
      productId: $productId
      totalQuantity: $totalQuantity
      availableStock: $availableStock
      ordered: $ordered
    ) {
      id
      productId
      totalQuantity
      availableStock
      ordered
    }
  }
`;

export const UPDATE_ORDER_STATE = gql`
  mutation Mutation($updateOrderStateId: String!, $state: String!) {
    updateOrderState(id: $updateOrderStateId, state: $state) {
      id
      clientId
      date
      expectedDate
      products
      state
    }
  }
`;

export const UPDATE_ORDER_PRODUCTS = gql`
  mutation Mutation($updateOrderProductsId: String!, $products: JSON!) {
    updateOrderProducts(id: $updateOrderProductsId, products: $products) {
      id
      clientId
      date
      expectedDate
      products
      state
    }
  }
`;

export const ORDER_FILE_UPLOAD = gql`
  mutation Mutation(
    $file: Upload!
    $name: String!
    $fileUploadId: String!
    $date: String!
  ) {
    fileUpload(file: $file, name: $name, id: $fileUploadId, date: $date)
  }
`;

export const FILE_DOWNLOAD = gql`
  mutation Mutation($filename: String!) {
    fileDownload(filename: $filename)
  }
`;

export const FILE_DELETE = gql`
  mutation Mutation($filename: String!) {
    fileDelete(filename: $filename)
  }
`;

export const SHIPMENT_DELETE = gql`
  mutation Mutation($deleteOrderShipmentId: String!) {
    deleteOrderShipment(id: $deleteOrderShipmentId)
  }
`;

export const UPDATE_SHIPMENT_STATE = gql`
  mutation Mutation($updateOrderShipmentStateId: String!, $state: String!) {
    updateOrderShipmentState(id: $updateOrderShipmentStateId, state: $state) {
      id
      employee
      registrationNumber
      deliveryDate
      orders
    }
  }
`;

export const ADD_CALENDAR = gql`
  mutation Mutation($date: String!, $time: String!, $event: String!) {
    createCalendar(date: $date, time: $time, event: $event)
  }
`;

export const DELETE_CALENDAR = gql`
  mutation Mutation($deleteCalendarId: ID!) {
    deleteCalendar(id: $deleteCalendarId)
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation Mutation(
    $oldPassword: String!
    $newPassword: String!
    $token: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      token: $token
    )
  }
`;

export const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      firstname
      lastname
      position
      token
      firstLogin
      expiresIn
    }
  }
`;

export const UPDATE_ORDER_TRANSPORTTYPE = gql`
  mutation Mutation(
    $updateOrderTrasportTypeId: String!
    $transportType: String!
  ) {
    updateOrderTrasportType(
      id: $updateOrderTrasportTypeId
      transportType: $transportType
    ) {
      id
      clientId
      date
      expectedDate
      products
      state
      transportType
    }
  }
`;

export const UPDATE_ORDERSHIPPMENT_WAYBILL = gql`
  mutation Mutation($updateOrderShipmentWaybillId: String!, $waybill: JSON!) {
    updateOrderShipmentWaybill(
      id: $updateOrderShipmentWaybillId
      waybill: $waybill
    ) {
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
