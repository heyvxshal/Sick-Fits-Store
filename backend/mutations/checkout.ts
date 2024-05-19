/* eslint-disable */
import { KeystoneContext } from "@keystone-next/types";
import {
  CartItemCreateInput,
  OrderCreateInput,
} from "../.keystone/schema-types";
import StripeConfig from "../lib/stripe";

export default async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error("Sorry! You must be signed in to place an order");
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
        id
        name
        email
        cart {
          id
          quantity
          product {
            name
            price 
            description
            id
            photo {
              image {
                id
                publicUrlTransformed
              }
            }
          }
        }
`,
  });
  console.dir(user, { depth: null });

  // 2. Calculate the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(
    (acc: number, cartItem: CartItemCreateInput) =>
      acc + cartItem.product.price,
    0
  );
  console.log(amount);

  // 3. Create the charge with stripe library
  const charge = await StripeConfig.paymentIntents
    .create({
      amount,
      currency: "USD",
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  // 4. Convert the cartItems to OrderItems
  // 5. Create the order and return it
}
