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
    const options = {
      transformation: {
        name: 'name',
        description: 'desc',
        isOfficialClass: 'isOfficial',
        subGroups: 'children'
      }
    }

    const res = await ss.getGroups(options)

    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    console.log(`${res.length} resultaten`)
    // Write to file
    await jsonfile.writeFile('./out/13_get_groups_flat.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}

main()
