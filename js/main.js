let inputForm = document.querySelector(".inputForm");
let inputField = document.querySelector("#inputField");
let errorMsgP = document.querySelector("#errorMsgP");

let addressField = document.querySelector("#addressField");
let locationField = document.querySelector("#locationField");
let timezoneField = document.querySelector("#timezoneField");
let ispField = document.querySelector("#ispField");

let map;
let myMapMarker;
let mapCreated = false;

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

  if (mapCreated) {
    setMap(response.data.location.lat, response.data.location.lng);
  } else {
    initMap(response.data.location.lat, response.data.location.lng);
    mapCreated = true;
  }
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
  console.log("error: " + err);
}

function formSubmitHandler() {
  let inputValue = inputField.value;
  if (inputValue == "") {
    return;
  }
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

function initMap(lat, lng) {
  let myMapIcon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconAnchor: [23, 56],
  });

  map = L.map("map", {
    center: [lat, lng],
    zoom: 12,
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

  myMapMarker = L.marker([lat, lng], { icon: myMapIcon }).addTo(map);
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
  getStartLocation();
  inputForm.addEventListener("submit", formSubmitHandler);
  inputField.focus();
}

window.onload = init();
