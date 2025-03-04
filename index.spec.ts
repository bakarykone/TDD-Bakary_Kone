import { Carte, Couleur, Rang, TypeMain } from "./types";
import { CarteUtils, MainPoker, evaluerMain, comparerMains } from "./index";
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

  describe("Carte Haute", () => {
    it("devrait identifier une main avec carte haute", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.CARTE_HAUTE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Paire", () => {
    it("devrait identifier une paire", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.PAIRE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Deux Paires", () => {
    it("devrait identifier deux paires", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.ROI, couleur: Couleur.TREFLE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.DEUX_PAIRES);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Brelan", () => {
    it("devrait identifier un brelan", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.AS, couleur: Couleur.TREFLE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.BRELAN);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Quinte", () => {
    it("devrait identifier une quinte", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.VALET, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.QUINTE);
      expect(resultat.valeur).toBe(Rang.AS);
    });

    it("devrait identifier une quinte avec As en bas", () => {
      const main: Carte[] = [
        { rang: Rang.CINQ, couleur: Couleur.COEUR },
        { rang: Rang.QUATRE, couleur: Couleur.PIQUE },
        { rang: Rang.TROIS, couleur: Couleur.TREFLE },
        { rang: Rang.DEUX, couleur: Couleur.CARREAU },
        { rang: Rang.AS, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.QUINTE);
      expect(resultat.valeur).toBe(Rang.CINQ);
    });
  });

  describe("Couleur", () => {
    it("devrait identifier une couleur", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
        { rang: Rang.HUIT, couleur: Couleur.COEUR },
        { rang: Rang.SIX, couleur: Couleur.COEUR },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.COULEUR);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Full", () => {
    it("devrait identifier un full", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.AS, couleur: Couleur.TREFLE },
        { rang: Rang.ROI, couleur: Couleur.CARREAU },
        { rang: Rang.ROI, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.FULL);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Carré", () => {
    it("devrait identifier un carré", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.AS, couleur: Couleur.TREFLE },
        { rang: Rang.AS, couleur: Couleur.CARREAU },
        { rang: Rang.ROI, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.CARRE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Quinte Flush", () => {
    it("devrait identifier une quinte flush", () => {
      const main: Carte[] = [
        { rang: Rang.ROI, couleur: Couleur.COEUR },
        { rang: Rang.DAME, couleur: Couleur.COEUR },
        { rang: Rang.VALET, couleur: Couleur.COEUR },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
        { rang: Rang.NEUF, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.QUINTE_FLUSH);
      expect(resultat.valeur).toBe(Rang.ROI);
    });
  });

  describe("Quinte Flush Royale", () => {
    it("devrait identifier une quinte flush royale", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.COEUR },
        { rang: Rang.DAME, couleur: Couleur.COEUR },
        { rang: Rang.VALET, couleur: Couleur.COEUR },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.QUINTE_FLUSH_ROYALE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Comparaison de mains", () => {
    it("devrait déterminer la meilleure main entre deux cartes hautes", () => {
      const main1: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const main2: Carte[] = [
        { rang: Rang.ROI, couleur: Couleur.COEUR },
        { rang: Rang.DAME, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      expect(comparerMains(main1, main2)).toBe(1);
      expect(comparerMains(main2, main1)).toBe(-1);
    });

    it("devrait déterminer la meilleure main entre différentes combinaisons", () => {
      const paire: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.HUIT, couleur: Couleur.TREFLE },
        { rang: Rang.SIX, couleur: Couleur.CARREAU },
        { rang: Rang.QUATRE, couleur: Couleur.COEUR },
      ];

      const carteHaute: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.VALET, couleur: Couleur.CARREAU },
        { rang: Rang.NEUF, couleur: Couleur.COEUR },
      ];

      expect(comparerMains(paire, carteHaute)).toBe(1);
      expect(comparerMains(carteHaute, paire)).toBe(-1);
    });
  });

  describe("Validation et cas d'erreur", () => {
    it("devrait rejeter une main avec plus de 5 cartes", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.VALET, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
        { rang: Rang.NEUF, couleur: Couleur.COEUR },
      ];

      expect(() => evaluerMain(main)).toThrow(
        "Une main doit contenir exactement 5 cartes"
      );
    });

    it("devrait rejeter une main avec moins de 5 cartes", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
      ];

      expect(() => evaluerMain(main)).toThrow(
        "Une main doit contenir exactement 5 cartes"
      );
    });

    it("devrait rejeter une main vide", () => {
      const main: Carte[] = [];
      expect(() => evaluerMain(main)).toThrow(
        "Une main doit contenir exactement 5 cartes"
      );
    });

    it("devrait gérer correctement les cartes en double", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.VALET, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
      ];

      const resultat = evaluerMain(main);
      expect(resultat.typeMain).toBe(TypeMain.PAIRE);
      expect(resultat.valeur).toBe(Rang.AS);
    });
  });

  describe("Cas limites de comparaison", () => {
    it("devrait gérer l'égalité parfaite", () => {
      const main: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.VALET, couleur: Couleur.CARREAU },
        { rang: Rang.DIX, couleur: Couleur.COEUR },
      ];

      expect(comparerMains(main, main)).toBe(0);
    });

    it("devrait comparer correctement deux mains de même type mais de valeurs différentes", () => {
      const paireDAs: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.CINQ, couleur: Couleur.TREFLE },
        { rang: Rang.QUATRE, couleur: Couleur.CARREAU },
        { rang: Rang.TROIS, couleur: Couleur.COEUR },
      ];

      const paireDeRois: Carte[] = [
        { rang: Rang.ROI, couleur: Couleur.COEUR },
        { rang: Rang.ROI, couleur: Couleur.PIQUE },
        { rang: Rang.CINQ, couleur: Couleur.TREFLE },
        { rang: Rang.QUATRE, couleur: Couleur.CARREAU },
        { rang: Rang.TROIS, couleur: Couleur.COEUR },
      ];

      expect(comparerMains(paireDAs, paireDeRois)).toBe(1);
      expect(comparerMains(paireDeRois, paireDAs)).toBe(-1);
    });

    it("devrait comparer correctement les cartes en cas d'égalité", () => {
      const paireDAsAvecRoi: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.ROI, couleur: Couleur.TREFLE },
        { rang: Rang.QUATRE, couleur: Couleur.CARREAU },
        { rang: Rang.TROIS, couleur: Couleur.COEUR },
      ];

      const paireDAsAvecDame: Carte[] = [
        { rang: Rang.AS, couleur: Couleur.COEUR },
        { rang: Rang.AS, couleur: Couleur.PIQUE },
        { rang: Rang.DAME, couleur: Couleur.TREFLE },
        { rang: Rang.QUATRE, couleur: Couleur.CARREAU },
        { rang: Rang.TROIS, couleur: Couleur.COEUR },
      ];

      expect(comparerMains(paireDAsAvecRoi, paireDAsAvecDame)).toBe(1);
      expect(comparerMains(paireDAsAvecDame, paireDAsAvecRoi)).toBe(-1);
    });
  });
});
