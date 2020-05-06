// Mapbox
const coordinates = [-0.1282759, 51.5080276];

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VzdGF2b3phcGF0YSIsImEiOiJjazl1NXNrdDUwYXR6M2hub2EyNmM4bmxrIn0.JgktKf_RqP9Ess-LDLHo-A";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/gustavozapata/ck9u9grgl14cg1imldvblhtdm",
  center: coordinates,
  zoom: 9,
  // scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

new mapboxgl.Marker({
  element: document.querySelector(".pin"),
  anchor: "bottom",
})
  .setLngLat(coordinates)
  .addTo(map);

new mapboxgl.Popup({
  offset: 35,
})
  .setLngLat(coordinates)
  .setHTML("<p>Zona was built here</p>")
  .addTo(map);

bounds.extend(coordinates);

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
