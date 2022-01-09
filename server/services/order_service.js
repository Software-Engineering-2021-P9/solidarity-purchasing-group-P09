"use strict";

const {
  OrderProductStatus,
  ShipmentType,
  OrderStatus,
} = require("../models/order");
const { ProductAvailabilityStatus } = require("../models/product_availability");

exports.getPriceForShipmentType = (shipmentType) =>
  shipmentType === ShipmentType.SHIPMENT ? 5.0 : 0.0;

exports.getOrderProductStatusForProductAvailabilityStatus = (
  productAvailabilityStatus
) =>
  productAvailabilityStatus === ProductAvailabilityStatus.CONFIRMED
    ? OrderProductStatus.CONFIRMED
    : OrderProductStatus.WAITING;

exports.updateOrdersAfterProductAvailabilityConfirm = (
  productAvailability,
  orders
) => {
  let remainingQuantity = productAvailability.quantity;
  for (let order of orders) {
    for (let orderProduct of order.products) {
      if (
        orderProduct.productID.toString() !==
        productAvailability.productID.toString()
      ) {
        continue;
      }

      // If the order product quantity can be fullfilled by the availability, set it as confirmed.
      if (remainingQuantity - orderProduct.quantity >= 0) {
        orderProduct.status = OrderProductStatus.CONFIRMED;
        remainingQuantity -= orderProduct.quantity;
        // Else, if the order product quantity can be only partially fullfilled,
        // modify its quantity to match the availability and set it's state as modified.
      } else if (
        remainingQuantity - orderProduct.quantity < 0 &&
        remainingQuantity > 0
      ) {
        orderProduct.status = OrderProductStatus.MODIFIED;
        orderProduct.quantity = remainingQuantity;
        remainingQuantity = 0;
        // Else, if the order product cannot be fullfilled by the availability, set it as canceled.
      } else {
        orderProduct.status = OrderProductStatus.CANCELED;
        orderProduct.quantity = 0;
        continue;
      }
    }

    // Calculate new order total price
    order.totalPrice = order.products
      .map((op) => op.quantity * op.price)
      .reduce((a, b) => a + b);

    // Add shipment fee
    order.totalPrice = this.addShipmentPriceToOrderTotalPrice(
      order.totalPrice,
      order.shipmentInfo.type
    );

    // If all products are canceled, set the order as canceled
    if (
      order.products.filter((op) => op.status === OrderProductStatus.CANCELED)
        .length === order.products.length
    ) {
      order.status = OrderStatus.CANCELED;
    }
  }

  return orders;
};

exports.addShipmentPriceToOrderTotalPrice = (orderPrice, shipmentType) => {
  if (orderPrice !== 0)
    orderPrice += shipmentType === ShipmentType.SHIPMENT ? 5 : 0;

  console.log("aaaa", orderPrice);
  return orderPrice;
};
