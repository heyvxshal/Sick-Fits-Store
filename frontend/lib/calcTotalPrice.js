export default function calcTotalPrice(cart) {
  return cart.reduce((acc, cartItem) => {
    if (!cartItem.product) return acc; // Products can be deleted but they could still be in the cart
    return acc + cartItem.quantity * cartItem.product.price;
  }, 0);
}
