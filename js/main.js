let inputForm = document.querySelector(".inputForm");
let inputField = document.querySelector("#inputField");
let errorMsgP = document.querySelector("#errorMsgP");

let addressField = document.querySelector("#addressField");
let locationField = document.querySelector("#locationField");
let timezoneField = document.querySelector("#timezoneField");
let ispField = document.querySelector("#ispField");

let map;
let myMapMarker;

let regexIP =
  /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/;
let regexDomain =
  /([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*/;

function dataFieldHandler(response) {
  setDataFields(
    response.data.ip,
    response.data.location.city,
    response.data.location.region,
    response.data.location.postalCode,
    response.data.location.timezone,
    response.data.isp
  );
  setMap(response.data.location.lat, response.data.location.lng);
}

function setDataFields(ipAddress, city, region, postalcode, zone, isp) {
  let location = city + ", " + region + " " + postalcode;
  let timezone = "UTC " + zone;
  addressField.innerText = ipAddress;
  locationField.innerText = location;
  timezoneField.innerText = timezone;
  ispField.innerText = isp;
}

function setMap(lat, long) {
  map.setView(L.latLng(lat, long));
  myMapMarker.setLatLng(L.latLng(lat, long));
}

function setError(err) {
  inputForm.classList.remove("spinner");
  inputField.classList.add("error");
  errorMsgP.classList.add("error");
}

function formSubmitHandler() {
  let inputValue = inputField.value;
  inputField.classList.remove("error");
  errorMsgP.classList.remove("error");
  inputForm.classList.add("spinner");
  setTimeout(() => {
    if (inputValue.match(regexIP)) {
      let url =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_5cyfm8XsvR0eVIlblfzeQ0ttik1Fl&ipAddress=" +
        inputValue;
      getLocationData(url);
    } else if (inputValue.match(regexDomain)) {
      let url =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_5cyfm8XsvR0eVIlblfzeQ0ttik1Fl&domain=" +
        inputValue;
      getLocationData(url);
    } else {
      setError("error");
    }
  }, 2000);
}

function initMap() {
  let myMapIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconAnchor: [23, 56],
  });

  map = L.map("map", {
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

  myMapMarker = L.marker([51.505, -0.09], { icon: myMapIcon }).addTo(map);
}

function getLocationData(url) {
  axios
    .get(url)
    .then((response) => {
      dataFieldHandler(response);
      inputForm.classList.remove("spinner");
    })
    .catch((err) => {
      setError(err);
    });
}

function getStartLocation() {
  let myIP;
  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => (myIP = data.ip))
    .then(() => {
      let url =
        "https://geo.ipify.org/api/v2/country,city?apiKey=at_5cyfm8XsvR0eVIlblfzeQ0ttik1Fl&ipAddress=" +
        myIP;
      getLocationData(url);
    });
}

function init() {
  initMap();
  getStartLocation();
  inputForm.addEventListener("submit", formSubmitHandler);
  inputField.focus();
}

window.onload = init();
