import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

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

    const itemsModel = await OrderItemModel.findAll({
      where: {
        order_id: entity.id
      }
    })

    const items = itemsModel.map(item => {
      const orderItem = new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      )
      return orderItem;
    })

    const itemsToDelete: OrderItem[] = items.filter(item => {
      if (!entity.items.find(itemEntity => itemEntity.id == item.id)) {
        return item;
      }
    });

    for (const itemToDelete of itemsToDelete) {
      const resultDelete = await OrderItemModel.destroy({
        where: {
          id: itemToDelete.id,
        }
      })
      console.log(`
        Row deleted ${itemToDelete.id}
        Result Code: ${resultDelete}
      `)
    }

    const itemsToInsert = entity.items.filter(itemEntity => {
      if (!items.find(item => item.id == itemEntity.id)) {
        return itemEntity;
      }
    });

    for (const itemToInsert of itemsToInsert) {
      try {
        const { id, name, price, productId, quantity } = itemToInsert;
        const data = { id, name, price, product_id: productId, quantity, order_id: entity.id };
        const resultInsert = await OrderItemModel.create(data)
        console.log(`
        Row inserted ${itemToInsert.id}
        Result Code: ${resultInsert.toJSON()}
      `)
      }
      catch (err) {
        console.error(err)
      }
    }

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
