/* eslint-disable */
import { KeystoneContext } from "@keystone-next/types";
import { CartItemCreateInput } from "../.keystone/schema-types";
import { Session } from "../types";

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log("adding to cart");

  // 1. Query the current user to check if user is signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    // No session
    throw new Error("You must be logged in to do this!");
  }
  // 2. Query the current user's cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: "id, quantity",
  });

  const [existingCartItems] = allCartItems;

  if (existingCartItems) {
    console.log(
      `There are already ${existingCartItems.quantity}, increment by 1`
    );

    // 3. See if current item is present in cart
    // 4.1 If it is, increment by 1
    return await context.lists.CartItem.updateOne(
      // Update only single product
      {
        id: existingCartItems.id,
        data: { quantity: existingCartItems.quantity + 1 },
      }
    );
  }
  // 4.2 if its not, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
