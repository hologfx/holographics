module.exports = function() {
	return {
		files: [
			"package.json",
			"src/*.*",
			"src/**/*.*",
			"src/server/*.*",
			"src/server/**/*.*",
			"src/server/lib/*.*",
			"src/server/**/*.js",
			"src/server/public/favicon.ico",
			"user_data/*",
			"test/test_scaffold.js"
		],

		tests: [
			"test/API_tests/*.js",
			"test/integration_tests/*.js",
			"test/unit_tests/*.js"
		],

		env: {
			type: "node",
			runner: "node" // or full path to any node executable
		},

		runAllTestsInAffectedTestFile: true,
		loose: true,

		workers: {
			restart: true,
			initial: 1,
			regular: 1
		}
	}
}
