// http://nightwatchjs.org/guide#settings-file
module.exports = {
  'src_folders': ['test/e2e/specs'],
  'output_folder': 'test/e2e/reports',
  'custom_commands_path': ['node_modules/nightwatch-helpers/commands'],
  'custom_assertions_path': ['node_modules/nightwatch-helpers/assertions'],

  'webdriver': {
    'start_process': true
  },

  'test_settings': {
    'default': {
      'silent': true,
      'screenshots': {
        'enabled': true,
        'on_failure': true,
        'on_error': false,
        'path': 'test/e2e/screenshots'
      }
    },

    'chrome': {
      'webdriver': {
        'port': 9515,
        'server_path': require('chromedriver').path
      },

      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true,
        'acceptSslCerts': true,
        'chromeOptions': {
          'args': ['--headless']
        }
      }
    }
  }
}
