import { Listener, OrderCreatedEvent, Subjects } from "@awatickets/common";
import { queueGroupName } from "./queue-group-name";
import {Order} from "../../models/order"; 

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;  
  async onMessage(data: OrderCreatedEvent['data'], msg: any) {
    // Check if this order already exists
    const existingOrder = await Order.findById(data.id);
    
    // If order exists, check version. Should be exactly previousVersion + 1
    if (existingOrder && data.version !== existingOrder.version + 1) {
      throw new Error('Incorrect version number');
    }
    
    // If this is a new order, version should be 0
    if (!existingOrder && data.version !== 0) {
      throw new Error('Incorrect version number');
    }
    
    const order = Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      userId: data.userId,
      price: data.ticket.price
    });
    
    await order.save();

    msg.ack();
  }
}

