import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "home/contribution.yaml");

const GITHUB_REPO = "codex-storage/nim-codex";
const GITHUB_API = `https://api.github.com/repos/${GITHUB_REPO}/contributors`;

const headers = {
  Accept: "application/vnd.github+json",
};

async function main() {
  const res = await fetch(GITHUB_API, { headers });

  if (!res.ok) {
    console.error(
      `Failed to fetch contributors: ${res.status} ${res.statusText}`
    );
    process.exit(1);
  }

  const contributors = await res.json();

  const people = contributors.map((user) => ({
    name: user.login,
    src: user.avatar_url,
    width: 84,
    height: 84,
    github: `/${user.login}`,
  }));

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

  console.log(`contributors.yaml written with ${people.length} contributors.`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
