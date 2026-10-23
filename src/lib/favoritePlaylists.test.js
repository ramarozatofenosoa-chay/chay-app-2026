import test from "node:test";
import assert from "node:assert/strict";
import { listMusicFavorites } from "./favoritePlaylists.js";

test("returns a flat list, newest additions first, without categories", () => {
  const items = listMusicFavorites([
    { id: "old", category: "music", source_playlist_id: "a", created_date: "2026-01-01T00:00:00Z" },
    { id: "new", category: "music", source_playlist_id: "b", created_date: "2026-03-01T00:00:00Z" },
    { id: "mid", category: "music", source_playlist_id: "c", created_date: "2026-02-01T00:00:00Z" },
    { id: "film", category: "films", kind: "video", source_playlist_id: "d" },
  ]);

  assert.deepEqual(items.map((item) => item.id), ["new", "mid", "old"]);
});

test("manual order wins over the addition date", () => {
  const items = listMusicFavorites([
    { id: "a", category: "music", order: 5, created_date: "2026-03-01T00:00:00Z" },
    { id: "b", category: "music", order: 1, created_date: "2026-01-01T00:00:00Z" },
    { id: "c", category: "music", order: 5, created_date: "2026-02-01T00:00:00Z" },
  ]);

  // b (ordre 1) d'abord ; puis ordre manuel égal (5) → date d'ajout la plus récente.
  assert.deepEqual(items.map((item) => item.id), ["b", "a", "c"]);
});

test("keeps legacy music favorites without explicit fields", () => {
  const items = listMusicFavorites([
    { id: "1", category: "music", title: "First", created_date: "2026-01-01T00:00:00Z" },
    { id: "2", title: "Second", created_date: "2026-02-01T00:00:00Z" },
  ]);

  assert.deepEqual(items.map((item) => item.id), ["2", "1"]);
});
