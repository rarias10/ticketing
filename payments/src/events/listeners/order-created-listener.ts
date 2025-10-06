import { Listener, OrderCreatedEvent, Subjects } from "@awatickets/common";
import { queueGroupName } from "./queue-group-name";
import {Order} from "../../models/order"; 

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;  
  async onMessage(data: OrderCreatedEvent['data'], msg: any) {
    
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

