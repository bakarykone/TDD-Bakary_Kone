import { Carte, Rang } from "./types";

export class CarteUtils {
  static trier(cartes: Carte[]): Carte[] {
    return [...cartes].sort((a, b) => b.rang - a.rang);
  }

  static compterOccurrences(cartes: Carte[]): Map<Rang, number> {
    return cartes.reduce((map, { rang }) => {
      map.set(rang, (map.get(rang) || 0) + 1);
      return map;
    }, new Map<Rang, number>());
  }

  static estCouleur(cartes: Carte[]): boolean {
    return cartes.every(({ couleur }) => couleur === cartes[0].couleur);
  }

  static estQuinte(cartes: Carte[]): {
    estQuinte: boolean;
    hauteur: Rang | null;
  } {
    const rangs = cartes.map(({ rang }) => rang);
    if (
      rangs[0] === Rang.AS &&
      rangs.slice(1).toString() ===
        [Rang.CINQ, Rang.QUATRE, Rang.TROIS, Rang.DEUX].toString()
    ) {
      return { estQuinte: true, hauteur: Rang.CINQ };
    }
    return rangs.every((rang, i) => i === 4 || rang - rangs[i + 1] === 1)
      ? { estQuinte: true, hauteur: rangs[0] }
      : { estQuinte: false, hauteur: null };
  }
}
