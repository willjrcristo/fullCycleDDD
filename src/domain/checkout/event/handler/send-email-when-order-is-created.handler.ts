import CustomerCreatedEvent from "../order-created.event";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import OrderCreatedEvent from "../order-created.event";

export default class SendEmailWhenOrderIsCreatedHandler
  implements EventHandlerInterface<OrderCreatedEvent>
{
  handle(event: OrderCreatedEvent): void {
    console.log(`Sending email to with new order created ..... `); 
  }
}
