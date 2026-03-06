import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/calculator", "/challenges", "/leaderboard", "/profile", "/chef-ventes", "/direction", "/marque", "/groupe", "/notifications"],
      },
    ],
    sitemap: "https://autoperf.vercel.app/sitemap.xml",
  }
}
