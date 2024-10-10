import ChangedAddressEvent from "../changed-address.event";
import CustomerCreatedEvent from "../customer-created.event";
import EventHandlerInterface from "../../../@shared/event/event-handler.interface";

export default class EnviaConsoleLogHandler 
implements EventHandlerInterface<CustomerCreatedEvent>
{
    handle(event: ChangedAddressEvent): void {
        console.log(`Endereço do cliente: ${event.id}, ${event.name} alterado para: ${event.address}`);
    }

}