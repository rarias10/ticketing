export enum OrderStatus {
  // When the order has been created, but the ticket it is trying to
  // order has not been reserved
  Created = 'created',

  // When the order has been cancelled by the user
  // or because the ticket it is trying to order was already reserved
  // or when the order expires before payment
  
  Cancelled = 'cancelled',

  // When the order is awaiting payment
  AwaitingPayment = 'awaiting:payment',

  // When the order has been completed and the ticket is reserved
  Complete = 'complete'
}