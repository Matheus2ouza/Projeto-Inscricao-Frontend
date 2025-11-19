import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { verifySession } from "./shared/lib/session";

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const MAINTENANCE_MODE =
  process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true" ||
  process.env.MAINTENANCE_MODE === "true";
const MAINTENANCE_PATH = "/maintenance";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/" || pathname === "/documentation") return true;
  if (pathname === "/login") return true; // pública, mas redireciona se autenticado
  if (pathname.startsWith("/events/")) return true; // página pública dinâmica
  return false;
}

function shouldRedirectWhenAuthenticated(pathname: string): boolean {
  return pathname === "/login";
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (MAINTENANCE_MODE) {
    if (!pathname.startsWith(MAINTENANCE_PATH)) {
      const maintenanceUrl = request.nextUrl.clone();
      maintenanceUrl.pathname = MAINTENANCE_PATH;
      maintenanceUrl.search = "";
      return NextResponse.rewrite(maintenanceUrl);
    }
    return NextResponse.next();
  }

  const authToken = request.cookies.get("authToken")?.value;
  const isPublic = isPublicPath(pathname);

  // Sem token
  if (!authToken) {
    // Rotas públicas passam
    if (isPublic) {
      console.log("[middleware] no auth token but public route", pathname);
      return NextResponse.next();
    }

    // Rotas privadas redirecionam ao login
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    console.warn(
      "[middleware] no auth token, redirecting to login",
      redirectUrl.pathname
    );
    return NextResponse.redirect(redirectUrl);
  }

  // Com token, se rota pública que redireciona (ex.: /login), mandar para home do role
  if (shouldRedirectWhenAuthenticated(pathname)) {

    const session = await verifySession();
    if (session) {
      const role = session.user.role;
      const roleHome: Record<string, string> = {
        SUPER: "/super/home",
        ADMIN: "/admin/home",
        MANAGER: "/admin/home",
        USER: "/user/home",
      };
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = roleHome[role] ?? "/user/home";
      return NextResponse.redirect(redirectUrl);
    }
    console.warn(
      "[middleware] expected session for authenticated redirect but none found"
    );
  }

  // Com token em rota privada: validar sessão e prefixo do role
  if (!isPublic) {
    const session = await verifySession();
    if (!session) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
      console.warn(
        "[middleware] auth token present but session invalid, redirecting to login"
      );
      return NextResponse.redirect(redirectUrl);
    }

    const role = session.user.role;
    const roleHomePrefix: Record<string, string> = {
      SUPER: "/super/",
      ADMIN: "/admin/",
      MANAGER: "/admin/",
      USER: "/user/",
    };
    const requiredPrefix = roleHomePrefix[role] ?? "/user/";

    if (!pathname.startsWith(requiredPrefix)) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = requiredPrefix;
      return NextResponse.redirect(redirectUrl);
    }
  }
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - xlsx (permitir arquivos Excel)
     */
    "/((?!api|_next/static|_next/image|images/|xlsx/|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
