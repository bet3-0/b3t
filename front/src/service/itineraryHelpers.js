export default class ItineraryHelpers {
  static getItineraryColor(idParcours) {
    switch (idParcours) {
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
    switch (idParcours) {
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
    switch (idParcours) {
      case 0:
        return "Bosses et Bobos";
      case 1:
        return "Trois étoiles";
      case 2:
        return "Cés'Art";
      case 3:
        return "Robinson";
      default:
        return "La Halte"; // où mettre la halte ?
    }
  }
}
