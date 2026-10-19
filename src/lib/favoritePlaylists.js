export function groupMusicFavorites(items) {
  const musicItems = (Array.isArray(items) ? items : [])
    .filter((item) => (item.category || "music") === "music" && item.kind !== "video");

  if (!musicItems.length) return [];

  return [
    {
      id: "favorites",
      name: "Mes favoris",
      order: 0,
      items: musicItems.sort((a, b) => (a.order ?? 99999) - (b.order ?? 99999)),
    },
  ];
}
