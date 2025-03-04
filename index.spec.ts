import { Carte, Couleur, Rang } from "./types";
import { CarteUtils } from "./index";
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
});
