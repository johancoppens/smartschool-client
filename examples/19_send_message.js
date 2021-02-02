// Import SmartSchool client
const ss = require('../index')
const conf = require('./config')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    await ss.sendMessage({
      userName: 'jane.roe',
      title: 'test',
      body: 'test body',
      fromUser: 'noreply'
    })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
