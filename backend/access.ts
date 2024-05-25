// Access control returns a value - (yes or no) depending on users session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session; // !! takes the falsy and truthy values and converts them into true or false
}

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
