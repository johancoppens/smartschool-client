const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)

// Demo groepen als array of objects
const groups = [
  {
    groupId: 'demoGroup1',
    description: 'Groep 1 voor demo smartschool-client'
  },
  {
    groupId: 'demoGroup2',
    description: 'Groep 2 voor demo smartschool-client'
  },
  {
    groupId: 'demoGroup1.1',
    description: 'Groep 1.1 voor demo smartschool-client, subGroup of demoGroup1',
    parent: 'demoGroup1'
  }
]

// Demo users
const users = [
  {
    userName: 'john.doe',
    password: 'Pa55word',
    firstName: 'John',
    surName: 'Doe',
    gender: 'm',
    birthDate: '1970-01-01',
    internalNumber: '1'
  },
  {
    userName: 'jane.roe',
    password: 'Pa55word',
    firstName: 'Jane',
    surName: 'Roe',
    gender: 'f',
    birthDate: '1970-01-02',
    internalNumber: '2'
  },
  {
    userName: 'james.doe',
    password: 'Pa55word',
    firstName: 'James',
    surName: 'Doe',
    gender: 'm',
    internalNumber: '3'
  }
]

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    for (const group of groups) {
      try {
        await ss.createGroup(group)
      } catch (err) {
        console.log(err)
      }
    }

    for (const user of users) {
      try {
        await ss.createUser(user)
      } catch (err) {
        console.log(err)
      }
      try {
        const photo = await readFile(`../assets/${user.userName}.jpeg`, 'base64')
        await ss.setUserPhoto({ userName: user.userName, photo: photo })
      } catch (err) {
        console.log(err)
      }
      try {
        // Alle nieuwe gebruikers in demoGroup1
        await ss.addUserToGroup({ userName: user.userName, groupOrClassId: 'demoGroup1' })
      } catch (err) {
        console.log(err)
      }
    }
  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()
