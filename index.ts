import { Carte, Rang, TypeMain, ResultatComparaison } from "./types";

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

export class MainPoker {
  private readonly cartesTriees: Carte[];
  private readonly occurrences: Map<Rang, number>;

  constructor(private readonly cartes: Carte[]) {
    if (cartes.length !== 5)
      throw new Error("Une main doit contenir exactement 5 cartes");

    this.cartesTriees = CarteUtils.trier(cartes);
    this.occurrences = CarteUtils.compterOccurrences(this.cartesTriees);
  }

  private trouverMultiples(): { brelan?: Rang; paire: Rang[]; carre?: Rang } {
    let brelan: Rang | undefined;
    let carre: Rang | undefined;
    const paires: Rang[] = [];

    for (const [rang, count] of this.occurrences.entries()) {
      if (count === 4) carre = rang;
      else if (count === 3) brelan = rang;
      else if (count === 2) paires.push(rang);
    }

    return { brelan, paire: paires, carre };
  }

  private evaluerTypeMain(): ResultatComparaison {
    const estUneCouleur = CarteUtils.estCouleur(this.cartesTriees);
    const { estQuinte, hauteur: hauteurQuinte } = CarteUtils.estQuinte(
      this.cartesTriees
    );
    const { brelan, paire, carre } = this.trouverMultiples();

    if (estUneCouleur && estQuinte) {
      return hauteurQuinte === Rang.AS
        ? { typeMain: TypeMain.QUINTE_FLUSH_ROYALE, valeur: Rang.AS }
        : { typeMain: TypeMain.QUINTE_FLUSH, valeur: hauteurQuinte! };
    }

    if (carre) return { typeMain: TypeMain.CARRE, valeur: carre };
    if (brelan && paire.length === 1)
      return { typeMain: TypeMain.FULL, valeur: brelan };
    if (estUneCouleur)
      return { typeMain: TypeMain.COULEUR, valeur: this.cartesTriees[0].rang };
    if (estQuinte) return { typeMain: TypeMain.QUINTE, valeur: hauteurQuinte! };
    if (brelan) return { typeMain: TypeMain.BRELAN, valeur: brelan };
    if (paire.length === 2)
      return { typeMain: TypeMain.DEUX_PAIRES, valeur: Math.max(...paire) };
    if (paire.length === 1)
      return { typeMain: TypeMain.PAIRE, valeur: paire[0] };

    return {
      typeMain: TypeMain.CARTE_HAUTE,
      valeur: this.cartesTriees[0].rang,
    };
  }

  evaluer(): ResultatComparaison {
    return this.evaluerTypeMain();
  }

  comparerAvec(autreMain: MainPoker): number {
    const eval1 = this.evaluer();
    const eval2 = autreMain.evaluer();

    return eval1.typeMain !== eval2.typeMain
      ? eval1.typeMain - eval2.typeMain
      : eval1.valeur !== eval2.valeur
      ? eval1.valeur - eval2.valeur
      : this.comparerCartes(autreMain);
  }

  private comparerCartes(autreMain: MainPoker): number {
    for (let i = 0; i < this.cartesTriees.length; i++) {
      if (this.cartesTriees[i].rang !== autreMain.cartesTriees[i].rang) {
        return this.cartesTriees[i].rang - autreMain.cartesTriees[i].rang;
      }
    }
    return 0;
  }
}

export function evaluerMain(main: Carte[]): ResultatComparaison {
  return new MainPoker(main).evaluer();
}

export function comparerMains(main1: Carte[], main2: Carte[]): number {
  return new MainPoker(main1).comparerAvec(new MainPoker(main2));
}
