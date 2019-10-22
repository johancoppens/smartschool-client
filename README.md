# smartschool-client

Deze module voorziet een aantal functies die een subset van de
Smartschool SOAP API implementeren in [Node.js](https://nodejs.org/en/).
De focus ligt op het ophalen van gegegevens van gebruikers en groepen/klassen (data pull).

Gecombineerd met bvb [node-cron](https://github.com/node-cron/node-cron) zou je in staat moeten zijn je eigen geautomatiseerde synchronisatie toepassing voor je school te maken.

Een voorbeeld toepassing voor het synchroniseren met een lokale database is in de maak ... stay tuned!

## Vereisten

* Installatie [Node.js](https://nodejs.org/en/) versie +v8.10.0.
* Activeren van de Smartschool API in Algemene instellingen > Webservices. Maak daar bij voorkeur een aangepast profiel aan.

## Installeren

### Methode 1: Clonen van Github

Deze methode is handig om de module te verkennen en de verschillende voorbeelden in de examples directory uit te proberen. Als je git niet hebt geïnstalleerd, kan je de code eventueel ook als zip-file downloaden van de github page.

```bash
$ git clone https://github.com/johancoppens/smartschool-client.git
$ cd smartschool-client
$ npm install
```

> Opgelet: Eerst examples/config.template.js hernoemen naar config.js en aanpassen naar de instellingen van je eigen Smartschool platform.

Je kan eerst het script create_sample_data.js in de examples directory uitvoeren om
je Smartschool platform te voorzien van voorbeeld data.

```bash
$ cd examples
$ node create_sample_data.js
```

Uitvoeren voorbeelden

```bash
$ node 00_get_user.js
```

Alle voorbeelden vind je hier: [Examples](./examples/)

Output van de voorbeeld-scripts kan je raadplegen in examples/out/

### Methode 2: Installeren met npm voor gebruik in een eigen project

In je project directory, run:

```bash
$ npm install --save github:johancoppens/smartschool-client
```

## API Documentatie

Vind je hier: [API](./api.md)

## Advanced Example

```javascript
/**
 * Geavanceerd voorbeeld
 * Haalt alle gebruikers op in de groep demoGroup1
 * Vervolgens wordt voor elke gevonden gebruiker de foto opgehaald
 * en weggeschreven als gebruikersnaam.jpeg in de out directory
 */
const ss = require('../index')
// Import config
const conf = require('./config')
const util = require('util')
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile)

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init(conf)

    const users = await ss.getUsers({
      groupId: 'demoGroup1',
      transformation: {
        userName: 'gebruikersnaam',
        fileName: (user) => {
          return `${user.gebruikersnaam}.jpeg`
        }
      }
    })

    for (const user of users) {
      try {
        const res = await ss.getUserPhoto({ userName: user.userName })
        await writeFile(`./out/${user.fileName}`, res, 'base64')
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

```