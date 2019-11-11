// Import smartschool-client
const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    // Hoofdaccount
    let res = await ss.updateUserPassword({
      userName: 'jane.roe',
      password: 'Pa55word',
      accountType: 0
    })

    // Co-account 1
    res = await ss.updateUserPassword({
      userName: 'jane.roe',
      password: 'Pa55word1',
      accountType: 1
    })

    // Co-account 2
    res = await ss.updateUserPassword({
      userName: 'jane.roe',
      password: 'Pa55word2',
      accountType: 2
    })

    console.log(util.inspect(res, { color: true, depth: null }))
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
