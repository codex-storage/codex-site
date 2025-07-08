const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { execSync } = require("child_process");

const GHOST_API_URL = "https://blog.codex.storage";
const GHOST_API_KEY = "";
const IMAGE_OUTPUT_DIR = "img/blog";
const YAML_OUTPUT_PATH = "home/blog.yaml";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function downloadImage(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${url}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

async function fetchArticles() {
  try {
    // Ensure image directory exists
    fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });

    const response = await fetch(
      `${GHOST_API_URL}/ghost/api/content/posts/?key=${GHOST_API_KEY}&limit=3&fields=title,excerpt,url,feature_image,published_at`
    );

    if (!response.ok) throw new Error("Failed to fetch articles");

    const data = await response.json();
    const articles = data.posts;
    const yamlData = {};

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const desc = (article.excerpt || "").slice(0, 200).trim() + "...";

      // Set up file paths
      const imgName = `article${i + 1}.webp`;
      const tmpImg = `tmp_article${i + 1}`;
      const tmpImgPath = path.join(IMAGE_OUTPUT_DIR, tmpImg);
      const webpImgPath = path.join(IMAGE_OUTPUT_DIR, imgName);

      if (article.feature_image) {
        // 1. Download original image
        await downloadImage(article.feature_image, tmpImgPath);

        // 2. Convert to WebP with max 800px width
        execSync(`convert "${tmpImgPath}" -resize 800x "${webpImgPath}"`);

        // 3. Clean up temp file
        fs.unlinkSync(tmpImgPath);
      }

      yamlData[`article${i + 1}`] = {
        title: article.title,
        description: desc,
        url: article.url,
        image: `/${webpImgPath}`, // adjust path if needed for frontend
        date: formatDate(article.published_at),
      };
    }

    // Write YAML
    const yamlString = yaml.dump(yamlData);
    fs.writeFileSync(YAML_OUTPUT_PATH, yamlString, "utf8");
    console.log("✅ blog.yaml has been generated with resized WebP images.");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

fetchArticles();
