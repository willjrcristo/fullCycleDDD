import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EventDispatcher from "./event-dispatcher";
import OrderCreatedEvent from "../../checkout/event/order-created.event";
import ProductCreatedEvent from "../../product/event/product-created.event";
import SendEmailWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-email-when-customer-is-created.handler";
import SendEmailWhenOrderIsCreatedHandler from "../../checkout/event/handler/send-email-when-order-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const productEventHandler = new SendEmailWhenProductIsCreatedHandler();
    const customerEventHandler = new SendEmailWhenCustomerIsCreatedHandler();
    const orderEventHandler = new SendEmailWhenOrderIsCreatedHandler();
    const spyProductEventHandler = jest.spyOn(productEventHandler, "handle");
    const spyOrderEventHandler = jest.spyOn(orderEventHandler, "handle");
    const spyCustomerEventHandler = jest.spyOn(customerEventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", productEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", customerEventHandler);
    eventDispatcher.register("OrderCreatedEvent", orderEventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(productEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(customerEventHandler);
    
    expect(
      eventDispatcher.getEventHandlers["OrderCreatedEvent"][0]
    ).toMatchObject(orderEventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyProductEventHandler).toHaveBeenCalled();
    
    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer 1",
      description: "Customer 1 description",
      documentNumber: "00000000000",
    });

    // Quando o notify for executado o SendEmailWhenCustomerIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyCustomerEventHandler).toHaveBeenCalled();
    
    const orderCreatedEvent = new OrderCreatedEvent({
      name: "Order 1",
      description: "Order  1 description",
      total: 999,
    });

    // Quando o notify for executado o SendEmailWhenOrderIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(orderCreatedEvent);

    expect(spyOrderEventHandler).toHaveBeenCalled();
  });
});
