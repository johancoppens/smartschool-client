// Import SmartSchool client
const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')
const jsonfile = require('jsonfile')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const options = {
      // userId: 1, // Intern nummer
      userId: 'john.doe' // of gebruikersnaam
    }
    const res = await ss.getUser(options)
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    // Write to file
    await jsonfile.writeFile('./out/00_get_user.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
