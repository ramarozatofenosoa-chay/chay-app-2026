import test from "node:test";
import assert from "node:assert/strict";
import { groupMusicFavorites } from "./favoritePlaylists.js";

test("groups all music favorites into a single merged playlist", () => {
  const groups = groupMusicFavorites([
    { id: "b2", track_id: "same", category: "music", source_playlist_id: "b", source_playlist_name: "B", order: 1 },
    { id: "a1", track_id: "other", category: "music", source_playlist_id: "a", source_playlist_name: "A", order: 0 },
    { id: "film", category: "films", kind: "video", source_playlist_id: "c" },
  ]);

  assert.deepEqual(groups.map((group) => group.id), ["favorites"]);
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].items.map((item) => item.id), ["a1", "b2"]);
  assert.equal(groups[0].name, "Mes favoris");
});

test("returns empty array when no music favorites", () => {
  const groups = groupMusicFavorites([
    { id: "film", category: "films", kind: "video", source_playlist_id: "c" },
  ]);
  assert.deepEqual(groups, []);
});
