import { CartItem } from "../schemas/CartItem";
import { User } from "../schemas/User";
import {
  CartItemCreateInput,
  OrderCreateInput,
} from "../.keystone/schema-types";

/* eslint-disable */
import { KeystoneContext, SessionStore } from "@keystone-next/types";
import stripeConfig from "../lib/stripe";

const graphql = String.raw;

interface Arguments {
  token: string;
}

async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error("Sorry! You must be signed in to create an order!");
  }
  // 1.5 Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
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
            id
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

  // 2. calc the total price for their order
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);

  // 3. create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: "USD",
      confirm: true,
      payment_method: token,

      // For testing
      off_session: true,
      description: "test",
      shipping: {
        name: user.name,
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });

  // 4. Convert the cartItems to OrderItems

  // 5. Create the order and return it

  // 6. Clean up any old cart item
}

export default checkout;
