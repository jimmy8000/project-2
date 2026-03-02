const locations = [
  { title: "New York City", position: { lat: 40.7128, lng: -74.006 } },
  { title: "Central Park", position: { lat: 40.7851, lng: -73.9683 } },
  { title: "Brooklyn Bridge", position: { lat: 40.7061, lng: -73.9969 } },
  { title: "Statue of Liberty", position: { lat: 40.6892, lng: -74.0445 } },
];

async function initMap() {
  const { InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { Autocomplete } = await google.maps.importLibrary("places");

  const mapEl = document.getElementById("my-map");
  await mapEl.innerMap;

  const infoWindow = new InfoWindow();

  // --- Search ---
  const input = document.getElementById("search-input");
  const autocomplete = new Autocomplete(input);
  autocomplete.bindTo("bounds", mapEl.innerMap);

  let searchMarker = null;

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      alert("No location found for: " + place.name);
      return;
    }

    mapEl.innerMap.setCenter(place.geometry.location);
    mapEl.innerMap.setZoom(15);

    if (searchMarker) searchMarker.map = null;

    searchMarker = new AdvancedMarkerElement({
      map: mapEl.innerMap,
      position: place.geometry.location,
      title: place.name,
      content: Object.assign(document.createElement("img"), {
        src: "https://images.icon-icons.com/3923/PNG/256/pin_gps_location_icon_250191.png",
        width: 50,
      }),
    });

    infoWindow.setContent(`
      <h3>${place.name}</h3>
      <p>${place.formatted_address}</p>
    `);
    infoWindow.open(mapEl.innerMap, searchMarker);
  });

  for (const location of locations) {
    const marker = new AdvancedMarkerElement({
      map: mapEl.innerMap,
      position: location.position,
      title: location.title,
      content: Object.assign(document.createElement("img"), {
        src: "https://images.icon-icons.com/3923/PNG/256/pin_gps_location_icon_250191.png",
        width: 50,
      }),
    });

    marker.addEventListener("click", () => {
      infoWindow.setContent(`<h3>${location.title}</h3>`);
      infoWindow.open(mapEl.innerMap, marker);
    });
  }
}

initMap();