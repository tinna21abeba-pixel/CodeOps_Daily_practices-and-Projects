export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://addis-eats.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/orders", "/orders/", "/staff", "/staff/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
