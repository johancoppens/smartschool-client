// Import SmartSchool client
const ss = require('../index')
// Import config
// Pas config.template aan naar uw platformgegevens
const conf = require('./config')
const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const res = await ss.getUserPhoto({ userName: 'john.doe' })

    // Write base64 encoded string to jpegfile
    await writeFile('./out/17_get_user_photo.jpeg', res, 'base64')
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
