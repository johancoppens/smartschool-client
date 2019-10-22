const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    // const res = await ss.setUserStateActive({
    //   userName: 'john.doe'
    // })

    // const res = await ss.setUserStateInactive({
    //   userName: 'john.doe'
    // })

    const res = await ss.setUserStateAdministrative({
      userName: 'john.doe'
    })

    console.log(util.inspect(res, { color: true, depth: null }))
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
