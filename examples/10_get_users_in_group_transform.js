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

    // Alle gebruikers in een specifieke groep + transformatie
    const options = {
      groupId: 'demoGroup1',
      transformation: {
        // Key is property name resulterende object, value is oorspronkelijke veldnaam
        firstName: 'voornaam', // Hernoemen velden
        lastName: 'naam',
        number: 'klasnummer',
        email: 'emailadres',
        birthDate: 'geboortedatum',
        lastLogin: 'last_successful_login', // Engels naar nederlands
        helloName: (obj) => { // Met een functie nieuwe objecten maken
          return `Hello ${obj.naam} ${obj.voornaam}!`
        },
        groupsAsString: (obj) => { // Omzetten Array naar string
          // Array met groepen als string weergeven gescheiden door ,
          let grps = ''
          obj.groups.forEach(grp => {
            grps += `${grp.name},`
          })
          // Verwijder laatste ,
          return grps.substring(0, grps.length - 1)
        }
      }
    }
    const res = await ss.getUsers(options)
    // Log to console
    console.log(util.inspect(res, { color: true, depth: null }))
    console.log(`${res.length} resultaten`)
    // Write to file
    await jsonfile.writeFile('./out/10_get_users_in_group_transform.json', res, { spaces: 2, EOL: '\r\n' })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
