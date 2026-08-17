// Load up the transport protocols
const io = require("./io")
const express = require("./express")

// Load up the app structure
const transports = require("../transports")
const Service = require("../services")

// Models
require("./models").initialize()

Service.use(transports.express(express))
Service.use(transports.socketio(io))
Service.use(transports.osc())

Service.list.forEach(service => {
	service.mount()
})
