import { test } from "node:test";
import assert from "node:assert/strict";
import { storefrontPathForSection, storefrontSectionFromPath } from "../src/services/storefrontNavigation";

test("direct storefront routes resolve to their sections", () => {
  const cases: Array<[string, string]> = [
    ["/", "home"], ["/live", "live"], ["/live-tv", "live"],
    ["/movies", "movies"], ["/series/", "series"], ["/sports", "sports"],
    ["/news", "news"], ["/music", "music"], ["/tv-guide", "guide"],
    ["/my-list", "list"], ["/search", "search"], ["/profile", "profile"],
  ];
  for (const [path, section] of cases) assert.equal(storefrontSectionFromPath(path), section);
});

test("section links use canonical paths and unknown sections fall back home", () => {
  assert.equal(storefrontPathForSection("home"), "/");
  assert.equal(storefrontPathForSection("live"), "/live");
  assert.equal(storefrontPathForSection("music"), "/music");
  assert.equal(storefrontPathForSection("list"), "/my-list");
  assert.equal(storefrontPathForSection("search"), "/search");
  assert.equal(storefrontPathForSection("unknown"), "/");
});

test("unknown URLs fall back to storefront home", () => {
  assert.equal(storefrontSectionFromPath("/not-a-section"), "home");
});
