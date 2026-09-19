/**
 * The one line that decides which client this build is for.
 *
 * `pnpm use-site <slug>` rewrites it. Do not import client configs anywhere
 * else — everything reads from `@/lib/site`.
 */
export { default as activeConfig } from '@clients/activa/site.config'
