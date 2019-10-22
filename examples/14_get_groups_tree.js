// Import SmartSchool client
const ss = require('../index')
// Import config
// Pas config.template aan naar uw platformgegevens
const conf = require('./config')
const util = require('util')
const jsonfile = require('jsonfile')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const res = await ss.getGroups({ flat: false })

    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    // Write to tmp.json file
    await jsonfile.writeFile('./out/14_get_groups_tree.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}

main()
