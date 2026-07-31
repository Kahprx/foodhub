import express from "express";
import Food from "../models/Food.js";
import Category from "../models/Category.js";

const router = express.Router();

const BASE = process.env.CLIENT_URL || "http://localhost:5173";

router.get("/robots.txt", async (req, res) => {
  res.type("text/plain").send(`
User-agent: *
Allow: /
Sitemap: ${BASE}/sitemap.xml
  `);
});

router.get("/sitemap.xml", async (req, res) => {
  const [foods, categories] = await Promise.all([
    Food.find().select("name updatedAt").limit(200),
    Category.find().select("slug"),
  ]);

  const urls = [
    { loc: `${BASE}/`, priority: 1.0 },
    { loc: `${BASE}/menu`, priority: 0.9 },
    ...categories.map((c) => ({ loc: `${BASE}/menu?category=${c.slug}`, priority: 0.7 })),
    ...foods.map((f) => ({ loc: `${BASE}/foods/${f._id}`, priority: 0.8, lastmod: f.updatedAt?.toISOString().slice(0, 10) })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.type("application/xml").send(xml);
});

export default router;
