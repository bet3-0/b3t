export default class ItineraryHelpers {
  static getItineraryColor(idParcours) {
    switch (parseInt(idParcours)) {
      case 0:
        return "var(--bosses-et-bobos)";
      case 1:
        return "var(--trois-etoiles)";
      case 2:
        return "var(--cesart)";
      case 3:
        return "var(--robinson)";
      default:
        return "var(--default)";
    }
  }
  static getItineraryRouteName(idParcours) {
    switch (parseInt(idParcours)) {
      case 0:
        return "bosses_et_bobos";
      case 1:
        return "trois_etoiles";
      case 2:
        return "cesart";
      case 3:
        return "robinson";
      default:
        return "default";
    }
  }
  static getParcoursName(idParcours) {
    switch (parseInt(idParcours)) {
      case 0:
        return "Bosses et Bobos";
      case 1:
        return "Trois étoiles";
      case 2:
        return "Cés'Arts";
      case 3:
        return "Robinson";
      case 4:
        return "La Halte";
      default:
        return "inconnu";
    }
  }

  static getParcoursImageName(idParcours) {
    switch (parseInt(idParcours)) {
      case 0:
        return "bosseEtBobo.png";
      case 1:
        return "troisEtoiles.png";
      case 2:
        return "cesArt.png";
      case 3:
        return "robinson.png";
      default:
        return "billy.png";
    }
  }
}
