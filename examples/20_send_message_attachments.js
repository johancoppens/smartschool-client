// Import SmartSchool client
const ss = require('../index')
const conf = require('./config')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const attachments = [
      {
        filename: 'james.jpeg',
        filedata: await readFile('../assets/james.doe.jpeg', 'base64')
      },
      {
        filename: 'test.docx',
        filedata: await readFile('../assets/test.docx', 'base64')
      },
      {
        filename: 'test.odt',
        filedata: await readFile('../assets/test.odt', 'base64')
      },
      {
        filename: 'test.pdf',
        filedata: await readFile('../assets/test.pdf', 'base64')
      }
    ]

    await ss.sendMessage({
      userName: 'johan.coppens',
      title: 'test',
      body: 'test body',
      fromUser: 'noreply',
      attachments: attachments
    })
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
