import { relationship, text } from "@keystone-next/fields";
import { list } from "@keystone-next/keystone/schema";
import { permissionFields } from "./fields";
import { permissions } from "../access";

export const Role = list({
  // Limit access control
  access: {
    create: permissions.canManageProducts,
    read: permissions.canManageProducts,
    update: permissions.canManageProducts,
    delete: permissions.canManageProducts,
  },
  // Hide ui if not (admin)
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ isRequired: true }),
    ...permissionFields,
    assignedTo: relationship({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
