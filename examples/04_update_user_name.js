// Import smartschool-client
const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    // Alleen verplichte velden opgegegeven
    const res = await ss.updateUserName({
      internalNumber: 3,
      newUserName: 'james.doe2'
    })

    console.log(util.inspect(res, { color: true, depth: null }))
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
