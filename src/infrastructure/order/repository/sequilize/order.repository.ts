import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


export default class OrderRepository implements OrderRepositoryInterface {
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
    const options = {
      where: { id },
      include: [{ model: OrderItemModel }],
    }
    const orderModel = await OrderModel.findOne(options);
    return new Order(
      orderModel.id, 
      orderModel.customer_id, 
      orderModel.items.map((item) => new OrderItem(
        item.id, 
        item.name, 
        item.price, 
        item.product_id, 
        item.quantity
      ))
    );
  }

  async findAll(): Promise<Order[]> {
    const ordersModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });
    return ordersModels.map((orderModel) =>
      new Order(
        orderModel.id,
        orderModel.customer_id, 
        orderModel.items.map((itemModel) => 
          new OrderItem(itemModel.id, itemModel.name, itemModel.price, itemModel.product_id, itemModel.quantity) 
        )
      )
    );
  }
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
