import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/rag-chat", "/image-gen", "/voice-agent", "/settings"],
      },
    ],
    sitemap: "https://instashark.com/sitemap.xml",
  };
}