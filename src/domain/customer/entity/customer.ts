import Address from "../value-object/address";
import ChangedAddressEvent from "../event/changed-address.event";
import CustomerCreatedEvent from "../event/customer-created.event";
import EnviaConsoleLog1Handler from "../event/handler/EnviaConsoleLog1Handler";
import EnviaConsoleLog2Handler from "../event/handler/EnviaConsoleLog2Handler";
import EnviaConsoleLogHandler from "../event/handler/EnviaConsoleLogHandler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

export default class Customer {
  private _id: string;
  private _name: string = "";
  private _address!: Address;
  private _active: boolean = false;
  private _rewardPoints: number = 0;

  private eventDispatcher: EventDispatcher;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;

    this.eventDispatcher = new EventDispatcher();

    const enviaConsoleLog1EventHandler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2EventHandler = new EnviaConsoleLog2Handler();

    const enviaConsoleLogHandler = new EnviaConsoleLogHandler();

    this.eventDispatcher.register("CustomerCreatedEvent",enviaConsoleLog1EventHandler);

    this.eventDispatcher.register("CustomerCreatedEvent",enviaConsoleLog2EventHandler);

    this.eventDispatcher.register("ChangedAddressEvent",enviaConsoleLogHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
      id,
      name
    });

    this.eventDispatcher.notify(customerCreatedEvent);
    
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get rewardPoints(): number {
    return this._rewardPoints;
  }

  validate() {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._name.length === 0) {
      throw new Error("Name is required");
    }
  }

  changeName(name: string) {
    this._name = name;
    this.validate();
  }

  get Address(): Address {
    return this._address;
  }
  
  changeAddress(address: Address) {
    this._address = address;

    const changedAddressEvent = new ChangedAddressEvent({
      id: this.id,
      name: this.name,
      address: address.toString(),
    });

    this.eventDispatcher.notify(changedAddressEvent);
  }

  isActive(): boolean {
    return this._active;
  }

  activate() {
    if (this._address === undefined) {
      throw new Error("Address is mandatory to activate a customer");
    }
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points;
  }

  set Address(address: Address) {
    this._address = address;
  }
}
