var ParcoursEnum = {
  0: "bosses-et-bobos",
  1: "trois-etoiles",
  2: "cesart",
  3: "robinson",
  4: "halte"
};

var ActiviteExemple = {
  id: 0,
  idParcours: 1,
  nom: "Titre de l'activité",
  description: "Ceci est la description de l'activité",
  materiel: "Il faut plein de matériel!",
  duree: "ça dure longtemps!",
  difficulte: "très très dur!",
  file: "<div>Mon activité personnalisée<div/>" // à remplacer par un fichier HTML
};

var app = new Vue({
  el: "#main-container", // Container de l'activité
  data: ActiviteExemple
});

function updateItineraryColor() {
  progressbar = document.getElementById("itinerary-bar");
  itinerary_class = "bg-bosses-et-bobos";
  progressbar.classList.add(itinerary_class);
}

function updateActivitybar() {
  progressbar = document.getElementById("activity-bar");
  progressbar.setAttribute("style", "width: 50%;");
  progressbar.innerHTML = "50%";
  updateItineraryColor();
}
