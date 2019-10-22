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

    // Haalt een klas of een groep op met code
    const res = await ss.getGroup({
      groupOrClassId: '1A1',
      transformation: {
        name: 'name',
        description: 'desc'
      }
    })
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    // Write to file
    if (res) await jsonfile.writeFile('./out/12_get_group_or_class.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
