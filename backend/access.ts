// Access control returns a value - (yes or no) depending on users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session; // !! takes the falsy and truthy values and converts them into true or false
}

// Check if user has a specific permission
const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no
export const permissions = {
  ...generatedPermissions,
};

// Rule based functions

// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    } // If not signed in return error

    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // If not, do they own this item
    return { user: { id: session.itemId } }; // graphql where filter
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageProducts({ session })) {
      return true; // role can read everything (admin)
    }

    // If not (admin), show only avaiable products (based on status field)

    return { status: "AVAILABLE" };
  },

  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // If not, do they own this item
    return { user: { id: session.itemId } };
  },

  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // If not, do they own this item
    return { order: { user: { id: session.itemId } } };
  },

  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageUsers({ session })) {
      return true;
    }

    // Otherwise they may only update themselves
    return { id: session.itemId };
  },
};
