import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // 👇 اضافه‌شده‌ها برای EmailProvider
    EMAIL_SERVER_USER: z.string().min(1),
    EMAIL_SERVER_PASSWORD: z.string().min(1),
    EMAIL_SERVER_HOST: z.string().min(1),
    EMAIL_SERVER_PORT: z.string().min(1),
    EMAIL_FROM: z.string().min(1),

  },

  /**
   * Client-side env vars (با NEXT_PUBLIC_ شروع می‌شوند)
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLOUDINARY_NAME: z.string().min(1),
  },

  /**
   * Runtime env mapping
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,

    // 👇 اضافه‌شده‌ها برای EmailProvider
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    NEXT_PUBLIC_CLOUDINARY_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});














































// import { createEnv } from "@t3-oss/env-nextjs";
// import { z } from "zod";

// export const env = createEnv({
//   /**
//    * Specify your server-side environment variables schema here. This way you can ensure the app
//    * isn't built with invalid env vars.
//    */
//   server: {
//     AUTH_SECRET:
//       process.env.NODE_ENV === "production"
//         ? z.string()
//         : z.string().optional(),
//     AUTH_DISCORD_ID: z.string(),
//     AUTH_DISCORD_SECRET: z.string(),
//     DATABASE_URL: z.string().url(),
//     NODE_ENV: z
//       .enum(["development", "test", "production"])
//       .default("development"),
//   },

//   /**
//    * Specify your client-side environment variables schema here. This way you can ensure the app
//    * isn't built with invalid env vars. To expose them to the client, prefix them with
//    * `NEXT_PUBLIC_`.
//    */
//   client: {
//     // NEXT_PUBLIC_CLIENTVAR: z.string(),
//   },

//   /**
//    * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
//    * middlewares) or client-side so we need to destruct manually.
//    */
//   runtimeEnv: {
//     AUTH_SECRET: process.env.AUTH_SECRET,
//     AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
//     AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
//     DATABASE_URL: process.env.DATABASE_URL,
//     NODE_ENV: process.env.NODE_ENV,
//   },
//   /**
//    * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
//    * useful for Docker builds.
//    */
//   skipValidation: !!process.env.SKIP_ENV_VALIDATION,
//   /**
//    * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
//    * `SOME_VAR=''` will throw an error.
//    */
//   emptyStringAsUndefined: true,
// });


// EMAIL_SERVER_USER= z.string().min(1),
// EMAIL_SERVER_PASSWORD= z.string().min(1),
// EMAIL_SERVER_HOST= z.string().min(1),
// EMAIL_SERVER_PORT= z.string().min(1),
// EMAIL_FROM= z.string().min(1),
