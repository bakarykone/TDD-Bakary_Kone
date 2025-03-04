export enum Couleur {
  COEUR = "♥",
  CARREAU = "♦",
  TREFLE = "♣",
  PIQUE = "♠",
}

export enum Rang {
  DEUX = 2,
  TROIS = 3,
  QUATRE = 4,
  CINQ = 5,
  SIX = 6,
  SEPT = 7,
  HUIT = 8,
  NEUF = 9,
  DIX = 10,
  VALET = 11,
  DAME = 12,
  ROI = 13,
  AS = 14,
}

export interface Carte {
  rang: Rang;
  couleur: Couleur;
}

export enum TypeMain {
  CARTE_HAUTE = 0,
  PAIRE = 1,
  DEUX_PAIRES = 2,
  BRELAN = 3,
  QUINTE = 4,
  COULEUR = 5,
  FULL = 6,
  CARRE = 7,
  QUINTE_FLUSH = 8,
  QUINTE_FLUSH_ROYALE = 9,
}

export interface ResultatComparaison {
  typeMain: TypeMain;
  valeur: number;
}
