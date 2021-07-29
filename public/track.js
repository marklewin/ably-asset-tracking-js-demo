import { Subscriber, Accuracy } from "/aat/main.js"

//const { Accuracy, Subscriber } = AblyAssetTracking

const ablyOptions = {
  key: "A9sjkA.lfPulA:3mNIFhvjKZx1z1Is",
  clientId: "aat-js-client",
}

// Define a callback to be notified when a location update is recieved.
const onLocationUpdate = (locationUpdate) => {
  console.log(
    `Location update recieved. Coordinates: ${locationUpdate.location.geometry.coordinates}`
  )
}

// Define a callback to be notified when the asset online status is updated.
const onStatusUpdate = (isOnline) => {
  console.log(
    `Status update: Publisher is now ${isOnline ? "online" : "offline"}`
  )
}

// Request a specific resolution to be considered by the publisher.
const resolution = {
  accuracy: Accuracy.High,
  desiredInterval: 1000,
  minimumDisplacement: 1,
}

// Initialise the subscriber.
const subscriber = new Subscriber({
  ablyOptions,
  onLocationUpdate,
  onStatusUpdate,
})

const trackingId = "ell5"

;(async () => {
  // Start tracking an asset using its tracking identifier.
  await subscriber.start(trackingId)

  // Request a new resolution to be considered by the publisher.
  await subscriber.sendChangeRequest({
    accuracy: Accuracy.Low,
    desiredInterval: 3000,
    minimumDisplacement: 5,
  })

  // Stop tracking the asset.
  await subscriber.stop()
})()
