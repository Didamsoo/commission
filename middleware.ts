import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/auth/callback"]

// Role → default home page
const ROLE_HOME: Record<string, string> = {
  commercial: "/dashboard",
  chef_ventes: "/chef-ventes",
  dir_concession: "/direction",
  dir_marque: "/marque",
  dir_plaque: "/groupe",
  admin: "/groupe",
}

// Role → numeric level
const ROLE_LEVELS: Record<string, number> = {
  commercial: 1,
  chef_ventes: 2,
  dir_concession: 3,
  dir_marque: 4,
  dir_plaque: 5,
  admin: 6,
}

// Route prefix → minimum role level required
const ROUTE_MIN_LEVEL: [string, number][] = [
  ["/groupe", 5],
  ["/marque", 4],
  ["/direction", 3],
  ["/chef-ventes", 2],
]

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // If user is NOT logged in and tries to access a protected route → redirect to login
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname === route + "/"
  )

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = (user.user_metadata?.role as string) || "commercial"
    const userLevel = ROLE_LEVELS[role] ?? 1

    // Redirect logged-in user away from login/register to their role-specific home
    if (pathname === "/login" || pathname === "/register") {
      const url = request.nextUrl.clone()
      url.pathname = ROLE_HOME[role] || "/dashboard"
      return NextResponse.redirect(url)
    }

    // Route protection: block access to pages requiring a higher role level
    for (const [prefix, minLevel] of ROUTE_MIN_LEVEL) {
      if (pathname.startsWith(prefix) && userLevel < minLevel) {
        const url = request.nextUrl.clone()
        url.pathname = ROLE_HOME[role] || "/dashboard"
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
