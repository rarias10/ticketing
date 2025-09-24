import "express";
import "cookie-session";

declare module "cookie-session" {
  interface CookieSessionObject {
    jwt?: string;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    // ✅ Now session can be null OR the CookieSessionObject
    session: import("cookie-session").CookieSessionObject | null | undefined;
  }
}
