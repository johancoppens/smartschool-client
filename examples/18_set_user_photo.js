// Import SmartSchool client
const ss = require('../index')
// Import config
// Pas config.template aan naar uw platformgegevens
const conf = require('./config')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const photo = await readFile('../assets/jane.roe.jpeg', 'base64')

    await ss.setUserPhoto({
      userName: 'jane.roe',
      photo: photo
    })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
