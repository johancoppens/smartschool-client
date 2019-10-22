// Import smartschool-client
const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const res = await ss.addUserToGroup({
      userName: 'john.doe',
      groupOrClassId: 'demoGroup1.1'
    })

    // const res = await ss.removeUserFromGroup({
    //   userName: 'john.doe',
    //   groupOrClassId: 'demoGroup1.1'
    // })

    console.log(util.inspect(res, { color: true, depth: null }))
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
