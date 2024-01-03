/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  /**
   * As per solution in an issue about Vercel including resource files and folders in the build.
   *
   * This is necessary for the sweph.set_ephe_path() function, so it finds the ephemeris files.
   *
   * @see https://github.com/vercel/next.js/discussions/14807#discussioncomment-6435359
   */
  experimental: {
    outputFileTracingIncludes: {
      "/api/trpc/chart*": ["./ephe/**/*"],
    }
  }
};

export default config;
