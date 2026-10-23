// « Votre Playlist » (favoris musicaux) est une liste plate, SANS catégorie :
// les chansons favorites de toutes les playlists d'origine sont mélangées.
// L'affichage dépend du jour où la chanson a été ajoutée (plus récent en
// premier). Le réordonnancement manuel reste possible : l'ordre enregistré
// (`order`) prend le pas sur la date d'ajout, sinon les déplacements de
// l'utilisateur seraient écrasés au prochain rafraîchissement.
export function listMusicFavorites(items) {
  const allFavorites = (Array.isArray(items) ? items : [])
    .filter((item) => (item.category || "music") === "music" && item.kind !== "video");

  return [...allFavorites].sort((a, b) => {
    const valA = a.order ?? 99999;
    const valB = b.order ?? 99999;
    if (valA !== valB) return valA - valB;
    // À ordre manuel égal, on retombe sur la date d'ajout (la plus récente d'abord).
    return new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime();
  });
}
