import { getToken } from 'next-auth/jwt';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';
const MAINTENANCE_MODE =
  process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ||
  process.env.MAINTENANCE_MODE === 'true';
const MAINTENANCE_PATH = '/maintenance';

const roleHome: Record<string, string> = {
  SUPER: '/super/home',
  ADMIN: '/admin/home',
  MANAGER: '/admin/home',
  USER: '/user/home',
};

const rolePrefix: Record<string, string> = {
  SUPER: '/super/',
  ADMIN: '/admin/',
  MANAGER: '/admin/',
  USER: '/user/',
};

function isPublicPath(pathname: string): boolean {
  if (pathname === '/' || pathname.startsWith('/documentation')) return true;
  if (pathname === '/login') return true;
  if (pathname.startsWith('/events/')) return true;
  if (pathname.startsWith('/guest/')) return true;
  if (pathname.startsWith('/exclusive/')) return true;
  return false;
}

function shouldRedirectWhenAuthenticated(pathname: string): boolean {
  return pathname === '/login';
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (MAINTENANCE_MODE) {
    if (!pathname.startsWith(MAINTENANCE_PATH)) {
      const maintenanceUrl = request.nextUrl.clone();
      maintenanceUrl.pathname = MAINTENANCE_PATH;
      maintenanceUrl.search = '';
      return NextResponse.rewrite(maintenanceUrl);
    }
    return NextResponse.next();
  }

  const isPublic = isPublicPath(pathname);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Sem sessão válida
  if (!token || token.error === 'RefreshAccessTokenError') {
    if (isPublic) {
      return NextResponse.next();
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    console.warn(
      '[middleware] no valid session, redirecting to login',
      redirectUrl.pathname,
    );
    return NextResponse.redirect(redirectUrl);
  }

  const role = token.role as string;

  // Autenticado tentando acessar /login -> manda pra home do role
  if (shouldRedirectWhenAuthenticated(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = roleHome[role] ?? '/user/home';
    return NextResponse.redirect(redirectUrl);
  }

  // Rota privada: valida prefixo do role
  if (!isPublic) {
    const requiredPrefix = rolePrefix[role] ?? '/user/';
    const normalizedPrefix =
      requiredPrefix.endsWith('/') && requiredPrefix.length > 1
        ? requiredPrefix.slice(0, -1)
        : requiredPrefix;
    const matchesPrefix =
      pathname === normalizedPrefix || pathname.startsWith(requiredPrefix);

    if (!matchesPrefix) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = roleHome[role] ?? '/user/home';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    '/((?!api|web-api|_next/static|_next/image|images/|xlsx/|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
