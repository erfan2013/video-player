import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";

import { db } from "~/server/db";
import { env } from "~/env"; // 👈 لازم بود

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // role?: UserRole
    } & DefaultSession["user"];
  }
  // interface User {
  //   // role?: UserRole
  // }
}

/**
 * NextAuth config
 */
export const authConfig = {
  adapter: PrismaAdapter(db),

  providers: [
    // Discord OAuth (اختیاری: اگر env ندارید موقتاً کامنت کنید)
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!, // یا env.AUTH_DISCORD_ID اگر در env.ts این‌طور تعریف کرده‌اید
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),

    // Email (Magic Link)
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: Number(env.EMAIL_SERVER_PORT ?? 587), // 👈 عدد شود
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
  ],

  // 👇 بیرون از providers باشد
  theme: {
    colorScheme: "auto",
    brandColor: "#F13287",
    logo: "",       // آدرس لوگو اگر دارید
    buttonText: "", // متن دکمه اگر لازم است
  },

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;








































// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";
// import EmailProvider from "next-auth/providers/email";

// import { db } from "~/server/db";

// /**
//  * Module augmentation for `next-auth` types.
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // role?: UserRole
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // role?: UserRole
//   // }
// }

// /**
//  * NextAuth config
//  */
// export const authConfig = {
//   adapter: PrismaAdapter(db),
//   providers: [
//     // Discord OAuth (اختیاری)
//     DiscordProvider({
//       clientId: process.env.DISCORD_CLIENT_ID!,
//       clientSecret: process.env.DISCORD_CLIENT_SECRET!,
//     }),

//     // Email (Magic Link)
//     EmailProvider({
//       server: {
//         host: env.EMAIL_SERVER_HOST,
//         port: env.EMAIL_SERVER_PORT,
//         auth: {
//           user: env.EMAIL_SERVER_USER,
//           pass: env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: env.EMAIL_FROM,
//     }),

//     theme:{
//       colorScheme: "auto",
//       brandColor: "#F13287",
//       logo: "",
//       buttonText: ""
//     }
//   ],
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
// } satisfies NextAuthConfig;
























































// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import DiscordProvider from "next-auth/providers/discord";

// import { db } from "~/server/db";

// /**
//  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
//  * object and keep type safety.
//  *
//  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
//  */
// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       // ...other properties
//       // role: UserRole;
//     } & DefaultSession["user"];
//   }

//   // interface User {
//   //   // ...other properties
//   //   // role: UserRole;
//   // }
// }

// /**
//  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
//  *
//  * @see https://next-auth.js.org/configuration/options
//  */
// export const authConfig = {
//   providers: [
//     DiscordProvider,
//     /**
//      * ...add more providers here.
//      *
//      * Most other providers require a bit more work than the Discord provider. For example, the
//      * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
//      * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
//      *
//      * @see https://next-auth.js.org/providers/github
//      */
//   ],
//   adapter: PrismaAdapter(db),
//   callbacks: {
//     session: ({ session, user }) => ({
//       ...session,
//       user: {
//         ...session.user,
//         id: user.id,
//       },
//     }),
//   },
// } satisfies NextAuthConfig;


