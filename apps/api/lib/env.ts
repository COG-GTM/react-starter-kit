import { z } from "zod";

/**
 * Zod schema for validating environment variables.
 * Ensures all required configuration values are present and correctly formatted.
 *
 * @throws {ZodError} When environment variables don't match the schema
 */
export const envSchema = z.object({
  ENVIRONMENT: z.enum(["production", "staging", "preview", "development"]),
  APP_NAME: z.string().default("Example"),
  APP_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_EMAIL_FROM: z.email(),
  // Stripe billing (optional — app works without these, billing features disabled)
  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),
  STRIPE_STARTER_PRICE_ID: z.string().startsWith("price_").optional(),
  STRIPE_PRO_PRICE_ID: z.string().startsWith("price_").optional(),
  STRIPE_PRO_ANNUAL_PRICE_ID: z.string().startsWith("price_").optional(),
});

/**
 * Runtime environment variables accessor.
 *
 * @remarks
 * - In Bun runtime: Variables are accessed via `Bun.env`
 * - In Cloudflare Workers: Variables must be accessed via request context
 * - Falls back to empty object when Bun global is unavailable
 *
 * @example
 * // In Bun runtime
 * const dbUrl = env.DATABASE_URL;
 *
 * // In Cloudflare Workers (must use context)
 * const dbUrl = context.env.DATABASE_URL;
 */
export const env =
  typeof Bun === "undefined" ? ({} as Env) : envSchema.parse(Bun.env);

/**
 * Type-safe environment variables interface.
 * Inferred from the Zod schema to ensure type safety.
 */
export type Env = z.infer<typeof envSchema>;

/** Validated environment variables (alias of {@link Env}). */
export type ValidatedEnv = Env;

/**
 * Validates the given environment against {@link envSchema}, throwing a single
 * error that lists every missing or malformed variable. Use this to fail fast
 * at startup so misconfiguration surfaces with a clear message instead of an
 * obscure runtime failure deep in a request handler.
 *
 * @throws {Error} When one or more variables are missing or invalid.
 */
export function validateEnv(env: Record<string, unknown>): ValidatedEnv {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${formatted}`);
  }
  return result.data;
}
