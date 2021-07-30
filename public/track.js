const { Subscriber, Accuracy } = AblyAssetTracking

let trackingId

// Initialize the map
let map = L.map("map", {
  scrollWheelZoom: true,
})
map.setView([0, 0], 12)
// Initialize the base layer
let osm_mapnik = L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map)

const ablyOptions = {
  authUrl: "/auth",
}

const pulsingIcon = L.icon.pulse({ iconSize: [20, 20], color: "red" })
let marker = L.marker([0, 0], { icon: pulsingIcon }).addTo(map)

function centerLeafletMapOnMarker(map, marker) {
  var latLngs = [marker.getLatLng()]
  var markerBounds = L.latLngBounds(latLngs)
  map.fitBounds(markerBounds)
}

// Define a callback to be notified when a location update is recieved.
const onLocationUpdate = (locationUpdate) => {
  console.log(locationUpdate.location.geometry.coordinates)
  let lng = locationUpdate.location.geometry.coordinates[0]
  let lat = locationUpdate.location.geometry.coordinates[1]

  marker.setLatLng(L.latLng(lat, lng))
  centerLeafletMapOnMarker(map, marker)
}

// Define a callback to be notified when the asset online status is updated.
const onStatusUpdate = (isOnline) => {
  document.getElementById("assetStatus").innerHTML = `Publisher: ${
    isOnline ? "online" : "offline"
  } Tracking: ${trackingId}`
}

// Initialise the subscriber.
const subscriber = new Subscriber({
  ablyOptions,
  onLocationUpdate,
  onStatusUpdate,
})

;(async () => {
  // Start tracking an asset using its tracking identifier.
  const response = await fetch("/track")
  trackingId = await response.text()
  console.log(`Tracking ${trackingId}`)

  await subscriber.start(trackingId)
})()
