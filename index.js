let map;

const markers = [];

function fitToMarkers() {
  if (!markers.length) return;
  const bounds = new google.maps.LatLngBounds();
  for (const m of markers) bounds.extend(m.position);
  map.fitBounds(bounds, 60);
}

function addMarker(position, title = "Marker") {
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position,
    title,
  });
  markers.push(marker);
  return marker;
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } =
    await google.maps.importLibrary("marker");
  const { Autocomplete } = await google.maps.importLibrary("places");

  map = new Map(document.getElementById("map"), {
  center: { lat: 41.8781, lng: -87.6298 },
  zoom: 11,
  gestureHandling: "greedy",
});

  const pin = new PinElement({
    background: "#FBBC04",
    borderColor: "#000000",
    glyphColor: "#000000",
  });

  const firstMarker = new AdvancedMarkerElement({
    map,
    position: { lat: 41.881832, lng: -87.623177 },
    content: pin.element,
    title: "Downtown",
  });
  markers.push(firstMarker);

  map.addListener("click", (e) => {
    addMarker(e.latLng, "Dropped pin");
  });

  const input = document.getElementById("search");
  const ac = new Autocomplete(input, {
    fields: ["geometry", "name", "formatted_address"],
  });

  ac.addListener("place_changed", () => {
    const place = ac.getPlace();
    if (!place?.geometry?.location) return;

    const pos = place.geometry.location;
    addMarker(pos, place.name || "Place");
    map.panTo(pos);
    map.setZoom(14);
  });
  document.getElementById("btnLocate").addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
        addMarker(pos, "You are here");
        map.panTo(pos);
        map.setZoom(15);
      },
      (err) => {
        alert("Could not get your location: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

initMap();