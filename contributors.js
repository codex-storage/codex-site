import fs from "fs/promises";
import fssync from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "home/contribution.yaml");
const IMAGE_OUTPUT_DIR = path.join(__dirname, "img/contributors");

const GITHUB_REPO = "codex-storage/nim-codex";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contributors`;

const headers = {
  Accept: "application/vnd.github+json",
};

async function downloadImage(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download: ${url}`);
  const buffer = await res.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(buffer));
}

async function main() {
  // Ensure directory exists
  await fs.mkdir(IMAGE_OUTPUT_DIR, { recursive: true });

  const res = await fetch(GITHUB_API, { headers });
  if (!res.ok) {
    console.error(
      `Failed to fetch contributors: ${res.status} ${res.statusText}`
    );
    process.exit(1);
  }

  const contributors = await res.json();

  const people = [];

  for (const user of contributors) {
    const username = user.login;
    const originalUrl = user.avatar_url;
    const tmpPath = path.join(IMAGE_OUTPUT_DIR, `${username}-tmp`);
    const webpPath = path.join(IMAGE_OUTPUT_DIR, `${username}.webp`);

    try {
      await downloadImage(originalUrl, tmpPath);

      // Resize and convert to WebP (84x84 hard crop)
      execSync(
        `convert "${tmpPath}" -resize 84x84^ -gravity center -extent 84x84 "${webpPath}"`
      );
      await fs.unlink(tmpPath); // remove temp image

      people.push({
        name: username,
        src: `/img/contributors/${username}.webp`,
        width: 84,
        height: 84,
        github: `/${username}`,
      });
    } catch (err) {
      console.warn(
        `⚠️ Failed processing image for ${username}: ${err.message}`
      );
    }
  }

  const yamlObject = {
    contribution: {
      links: [
        { label: "Testnet Operators", url: "/" },
        { label: "Discord", url: "/discord" },
        { label: "Github", url: "/github" },
      ],
      people,
    },
  };

  const yamlStr = yaml.dump(yamlObject, { lineWidth: 1000 });
  await fs.writeFile(OUTPUT_PATH, yamlStr);

  console.log(
    `✅ contributors.yaml written with ${people.length} contributors.`
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
