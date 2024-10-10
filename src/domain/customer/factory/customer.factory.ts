import Address from "../value-object/address";
import ChangedAddressEvent from "../event/changed-address.event";
import Customer from "../entity/customer";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLog1Handler from "../event/handler/EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../event/handler/EnviaConsoleLog2Handler";
import EnviaConsoleLogHandler from "../event/handler/EnviaConsoleLogHandler";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import { v4 as uuid } from "uuid";

export default class CustomerFactory {

  private eventDispatcher: EventDispatcher = new EventDispatcher();
  
  constructor(){

    const enviaConsoleLog1EventHandler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2EventHandler = new EnviaConsoleLog2Handler();

    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();

    this.eventDispatcher.register("CustomerCreatedEvent",enviaConsoleLog1EventHandler);

    this.eventDispatcher.register("CustomerCreatedEvent",enviaConsoleLog2EventHandler);

    this.eventDispatcher.register("ChangedAddressEvent",enviaConsoleLogHandler);

  }

  public create(name: string): Customer {
    const customer = new Customer(uuid(), name);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name
    });

    this.eventDispatcher.notify(customerCreatedEvent);

    return customer;
  }

  public createWithAddress(name: string, address: Address): Customer {
    const customer = new Customer(uuid(), name);
    customer.changeAddress(address);

    const changedAddressEvent = new ChangedAddressEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address.toString(),
    });

    this.eventDispatcher.notify(changedAddressEvent);
    
    return customer;
  }
}
