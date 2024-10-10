import CustomerCreatedEvent from "../customer-created.event";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";

export default class SendEmailWhenCustomerIsCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(`Sending email to with new customer created .....`); 
  }
}
