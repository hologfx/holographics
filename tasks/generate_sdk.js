global.path_to_app = "./"
global.base_dir = "./src"
global.user_data_dir = "./user_data"
global.appMode = {
	environment: "node",
	packed: false,
	development: true
}

require("../src/server/models").globalize()

const Service = require("../src/server/services")
const express = require("../src/server/transports/express")
const socket = require("../src/server/transports/socket.io")
const fs = require("fs")
const path = require("path")

const apiPath = "./node_modules/holographics-client-sdk"

function getArgs(func) {
	const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm
	const ARGUMENT_NAMES = /([^\s,]+)/g
	const fnStr = func.toString().replace(STRIP_COMMENTS, "")
	let result = fnStr
		.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
		.match(ARGUMENT_NAMES)
	if (result === null) result = []
	return result
}

const sdk = {
	path: "/api",
	services: {}
}

Service.list.forEach(service => {
	const name = service.name.toLowerCase()
	sdk.services[name] = {}

	Object.values(service.methods).forEach(method => {
		const restMethod = express.restMethod(method)
		const serviceMethodArgs = getArgs(method)
		const route = express.restRoute(method)
		const eventName = socket.eventName(method, service)

		sdk.services[name][method.name] = {
			route: `${sdk.path}/${name}${route}`,
			restMethod,
			eventName,
			args: serviceMethodArgs
		}
	})
})

fs.writeFileSync(path.join(apiPath, "services.json"), JSON.stringify(sdk))

console.log(sdk)

let docs = `# Holographics API

These are the current services and methods present in the API with examples. This document is auto-generated every release.\n\n`

Service.list.forEach(service => {
	docs += `## ${service.name}\n\n`

	if (service.events.length > 0) {
		docs += `### Events\n\n`
		Object.keys(service.events).forEach(eventName => {
			docs += ` - ${eventName}`
		})
	}

	docs += `### REST\n\n`
	Object.values(service.methods).forEach(method => {
		const restMethod = express.restMethod(method)
		const serviceMethodArgs = getArgs(method)
		const route = express.restRoute(method)

		docs += `${restMethod.toUpperCase()} ${
			sdk.path
		}/${service.name.toLowerCase()}${route} - (${serviceMethodArgs})\n\n`
	})

	docs += `### Websocket\n\n`
	Object.values(service.methods).forEach(method => {
		const serviceMethodArgs = getArgs(method)
		const eventName = socket.eventName(method, service)

		docs += `**${eventName}** (${serviceMethodArgs})\n\n`
	})

	docs += `### SDK Examples\n\n`
	Object.keys(service.methods).forEach(methodName => {
		const serviceMethodArgs = getArgs(service.methods[methodName])

		docs += `**Example for: ${methodName}**\n\n`

		docs += "```node\n"
		if (serviceMethodArgs.length > 0) {
			docs += `Holographics.${service.name.toLowerCase()}.${methodName}({\n`
			if (serviceMethodArgs.includes("id")) docs += "  id: 'resource id'\n"
			if (serviceMethodArgs.includes("data")) {
				docs += "  data: {\n"
				docs += "    resource: 'data'\n"
				docs += "  }\n"
			}
			docs += "}).then((response) => {\n"
			docs += "  console.log(response)\n"
			docs += "})\n"
		} else {
			docs += `Holographics.${service.name.toLowerCase()}.${methodName}().then((response) => {
  console.log(response)
})\n`
		}
		docs += "```\n\n"
	})
})

fs.writeFileSync(path.join(apiPath, "EXAMPLES.md"), docs)

process.exit(0)
