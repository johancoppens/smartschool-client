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

    // Alle gebruikers in een specifieke groep (Unieke klas- of groepscode in Smartschool)
    // Specifiëer hiervoor de groepsCode in een options object
    const options = {
      groupId: 'demoGroup1',
      recursive: true
    }
    const res = await ss.getUsers(options)
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    console.log(`${res.length} resultaten`)
    // Write to file
    await jsonfile.writeFile('./out/09_get_users_in_group.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
