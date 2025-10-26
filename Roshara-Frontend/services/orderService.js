import api from "../../lib/apiClient";

// create order with items + shipping + couponCode (optional)
export const createOrder = async ({
  userTokenIsAlreadyOnApi = true,
  orderItems,
  shippingAddress,
  paymentMethod = "cod",
  taxPrice = 0,
  shippingPrice = 0,
  couponCode = null,
}) => {
  const payload = {
    orderItems: orderItems.map((it) => ({
      product: it._id,
      quantity: it.qty,
      // name/price will be filled on backend anyway, but harmless to send
      name: it.name,
      price: it.price,
    })),
    shippingAddress,
    paymentMethod,
    taxPrice,
    shippingPrice,
    couponCode,
  };
  const res = await api.post("/orders", payload);
  return res.data;
};

