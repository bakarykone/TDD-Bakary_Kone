import { Carte, Couleur, Rang, TypeMain } from "./types";
import { CarteUtils, MainPoker } from "./index";
import { describe, it, expect } from "vitest";

describe("Poker - Évaluation des mains", () => {
  describe("CarteUtils - Tri des cartes", () => {
    it("devrait trier les cartes du plus grand au plus petit rang", () => {
      const cartes: Carte[] = [
        { rang: Rang.CINQ, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.DIX, couleur: Couleur.TREFLE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.SEPT, couleur: Couleur.COEUR },
      ];

      const cartesTriees = CarteUtils.trier(cartes);

      expect(cartesTriees).toEqual([
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.TREFLE },
        { rang: Rang.SEPT, couleur: Couleur.COEUR },
        { rang: Rang.CINQ, couleur: Couleur.COEUR },
      ]);
    });
  });

  describe("CarteUtils - Comptage des occurrences", () => {
    it("devrait compter correctement les occurrences des cartes", () => {
      const cartes: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.ROI, couleur: Couleur.TREFLE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
      ];

      const occurrences = CarteUtils.compterOccurrences(cartes);

      expect(occurrences.get(Rang.AS)).toBe(2);
      expect(occurrences.get(Rang.ROI)).toBe(2);
      expect(occurrences.get(Rang.DIX)).toBe(1);
      expect(occurrences.get(Rang.CINQ)).toBeUndefined();
    });
  });

  describe("MainPoker - Évaluation des mains", () => {
    it("devrait identifier une main avec carte haute", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const mainPoker = new MainPoker(main);
      const resultat = mainPoker.evaluer();

      expect(resultat.typeMain).toBe(TypeMain.CARTE_HAUTE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  it("devrait identifier un brelan", () => {
    const main: Carte[] = [
      { rang: Rang.AS, couleur: Couleur.COEUR },
      { rang: Rang.AS, couleur: Couleur.PIQUE },
      { rang: Rang.AS, couleur: Couleur.TREFLE },
      { rang: Rang.ROI, couleur: Couleur.CARREAU },
      { rang: Rang.QUATRE, couleur: Couleur.COEUR },
    ];

    const mainPoker = new MainPoker(main);
    const resultat = mainPoker.evaluer();

    expect(resultat.typeMain).toBe(TypeMain.BRELAN);
    expect(resultat.valeur).toBe(Rang.AS);
  });

  it("devrait identifier un full", () => {
    const main: Carte[] = [
      { rang: Rang.AS, couleur: Couleur.COEUR },
      { rang: Rang.AS, couleur: Couleur.PIQUE },
      { rang: Rang.AS, couleur: Couleur.TREFLE },
      { rang: Rang.ROI, couleur: Couleur.CARREAU },
      { rang: Rang.ROI, couleur: Couleur.COEUR },
    ];

    const mainPoker = new MainPoker(main);
    const resultat = mainPoker.evaluer();

    expect(resultat.typeMain).toBe(TypeMain.FULL);
    expect(resultat.valeur).toBe(Rang.AS);
  });
});
