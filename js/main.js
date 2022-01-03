function initMap() {
  let myIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconAnchor: [23, 56],
  });

  let map = L.map("map", {
    center: [51.505, -0.09],
    zoom: 13,
    attributionControl: false,
    zoomControl: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false,
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([51.505, -0.09], { icon: myIcon }).addTo(map);
}

function init() {
  console.log("hi");
  initMap();
}

window.onload = init();
