const fs = require("fs");
const yaml = require("js-yaml");

const GHOST_API_URL = "https://blog.codex.storage";
const GHOST_API_KEY = "dc7884e3d2c10dde2269926b20"; // Replace with your Ghost Content API key

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function fetchArticles() {
  try {
    // Fetch the 3 most recent articles
    const response = await fetch(
      `${GHOST_API_URL}/ghost/api/content/posts/?key=${GHOST_API_KEY}&limit=3&fields=title,excerpt,url,feature_image,published_at`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }

    const data = await response.json();
    const articles = data.posts;

    // Build the YAML structure
    const yamlData = {};
    articles.forEach((article, idx) => {
      let desc = article.excerpt || "";
      if (desc.length > 200) {
        desc = desc.slice(0, 200).trim() + "...";
      }

      yamlData[`article${idx + 1}`] = {
        title: article.title,
        description: desc,
        url: article.url,
        image: article.feature_image,
        date: formatDate(article.published_at),
      };
    });

    // Write the YAML file
    const yamlString = yaml.dump(yamlData);
    fs.writeFileSync("home/blog.yaml", yamlString, "utf8");

    console.log("blog.yaml has been generated successfully!");
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
}

// Call the function to fetch articles and build YAML
fetchArticles();
