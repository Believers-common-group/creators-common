import { existsSync, readFileSync } from "node:fs";

const required = [
  "out/index.html",
  "out/discover.html",
  "out/creators.html",
  "out/works.html",
  "out/experiences.html",
  "out/studio.html",
  "out/registry.html",
  "out/commons.html",
  "out/about.html",
  "out/health.json",
  "out/estate-site.json",
];

const missing = required.filter((path) => !existsSync(path));
if (missing.length) {
  console.error(`Missing static export artifacts:\n${missing.join("\n")}`);
  process.exit(1);
}

const home = readFileSync("out/index.html", "utf8");
for (const expected of ["Creators Common", "Create work", "Explore the Common"]) {
  if (!home.includes(expected)) {
    console.error(`Homepage export missing expected text: ${expected}`);
    process.exit(1);
  }
}

const estate = JSON.parse(readFileSync("out/estate-site.json", "utf8"));
if (estate.authority_boundary !== "WARDEN" || estate.session_policy !== "NO_SHARED_CROSS_DOMAIN_COOKIE") {
  console.error("Estate authority contract changed unexpectedly");
  process.exit(1);
}

console.log(`Validated ${required.length} static export artifacts.`);
