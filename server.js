// server.js
require("dotenv").config()

const express = require("express")
const app = express()
const path = require("path")
const Ably = require("ably")
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY })

app.use(
  "/aat",
  express.static(
    path.join(__dirname, "/node_modules/@ably/asset-tracking/dist")
  )
)

// make all the files in 'public' available
app.use(express.static("public"))

// load the home page, index.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

app.get("/track", (req, res) => {
  res.send(process.env.TRACKING_ID)
})

// authentication endpoint
app.get("/auth", (req, res) => {
  let tokenParams = {
    clientId: `client-${process.env.TRACKING_ID}`,
  }
  ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      res.status(500).send("Authentication error: " + JSON.stringify(err))
    } else {
      res.setHeader("Content-Type", "application/json")
      res.send(JSON.stringify(tokenRequest))
    }
  })
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Server started")
})
