export function groupMusicFavorites(items) {
  // 1. On filtre pour ne garder que les musiques (pas les vidéos)
  const allFavorites = (Array.isArray(items) ? items : [])
    .filter((item) => (item.category || "music") === "music" && item.kind !== "video");

  // 2. On trie TOUTES les chansons par le champ "order" (le cadenas/ordre)
  const sortedFavorites = allFavorites.sort((a, b) => {
    const valA = a.order ?? 99999;
    const valB = b.order ?? 99999;
    return valA - valB;
  });

  // 3. On retourne un SEUL groupe nommé "Toutes les chansons"
  // Cela empêche l'interface de créer des sous-catégories (Inspiration, Instrumental, etc.)
  return [{
    id: "all-favorites",
    name: "Toutes les chansons",
    order: 0,
    items: sortedFavorites
  }];
}
