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

    // Haalt alle unieke gebruikers van het platform op met alle beschikbare velden
    // Dit is een grote hoeveelheid data en kan even duren +-25sec :-)
    const res = await ss.getUsers()
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    console.log(`${res.length} resultaten`)
    // Write to file
    await jsonfile.writeFile('./out/08_get_users.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
