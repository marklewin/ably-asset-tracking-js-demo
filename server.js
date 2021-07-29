// server.js

const express = require("express")
const app = express()
const path = require("path")

console.log(__dirname)

app.use(
  "/aat",
  express.static(__dirname + "/node_modules/@ably/asset-tracking/dist")
)

// make all the files in 'public' available
app.use(express.static("public"))

// load the home page, index.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html")
})

// listen for requests :)
const listener = app.listen(8080, () => {
  console.log("Server started")
})
