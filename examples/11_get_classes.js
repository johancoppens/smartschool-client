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
        id: 'id',
        name: 'name',
        code: 'code',
        description: 'desc'
      }
    }

    // Haalt een lijst met alle klassen op
    const res = await ss.getClasses(options)
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    // Write to file
    await jsonfile.writeFile('./out/11_get_classes.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
