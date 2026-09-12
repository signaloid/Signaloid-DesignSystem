process.env.CHROME_BIN = require('playwright').chromium.executablePath();

module.exports = function (config) {
	config.set({
		frameworks: ['jasmine'],
		browsers: ['ChromeHeadlessNoSandbox'],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox', '--disable-dev-shm-usage'],
			},
		},
		reporters: ['progress'],
		restartOnFileChange: true,
	});
};
