import "dotenv/config";
import { config, createSchema } from "@keystone-next/keystone/schema";
import { createAuth } from "@keystone-next/auth";
import {
  withItemData,
  statelessSessions,
} from "@keystone-next/keystone/session";
import { User } from "./schemas/User";
import { Product } from "./schemas/Product";
import { ProductImage } from "./schemas/ProductImage";
import { insertSeedData } from "./seed-data";
import { sendPasswordResetEmail } from "./lib/mail";
import { CartItem } from "./schemas/Cart";
import { extendGraphqlSchema } from "./mutations";

const databaseURL =
  process.env.DATABASE_URL || "mongodb://localhost/keystone-sick-fits";

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // How long user should stay signed in
  secret: process.env.COOKIE_SECRET,
};

// Authentication
const { withAuth } = createAuth({
  listKey: "User", // Schema Name
  identityField: "email", // identify user by
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    // TODO: Add in initial roles
  },
  passwordResetLink: {
    async sendToken(args) {
      //  send email
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: "mongoose",
      url: databaseURL,
      async onConnect(keystone) {
        console.log("connected");
        if (process.argv.includes("--seed-data")) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      // Schema items go here
      User,
      Product,
      ProductImage,
      CartItem,
    }),
    extendGraphqlSchema, // extend graphQL Schema
    ui: {
      // Show ui only for user who pass this test
      isAccessAllowed: ({ session }) => {
        console.log(session);
        return !!session?.data; // !! makes in boolean (true or false)
      }, // Allow user who has a session and logged in
    },
    session: withItemData(statelessSessions(sessionConfig), {
      // GraphQL Query
      User: "id name email",
    }),
  })
);
