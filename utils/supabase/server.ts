import {
  CookieMethodsServerDeprecated,
  CookieOptionsWithName,
  createServerClient,
} from "@supabase/ssr";
import { SupabaseClientOptions } from "@supabase/supabase-js";

export const createSupabaseServerClient = (options: Options) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    options,
  );

type Options = SupabaseClientOptions<"public"> & {
  cookieOptions?: CookieOptionsWithName;
  cookies: CookieMethodsServerDeprecated;
  cookieEncoding?: "raw" | "base64url";
};
