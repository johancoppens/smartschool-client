# smartschool-client

Deze module voorziet een aantal functies die een subset van de
[Smartschool](http://www.smartschool.be/smartschool/) SOAP API implementeren in [Node.js](https://nodejs.org/en/) Javascript.

Alle functies retourneren pure javascript values/objecten. Je hoeft je niet meer bezig te houden met het parsen van JSON of XML strings en dergelijke.

Dit project is verre van compleet, maar zeker bruikbaar. Foutje, voorstellen? Plaats een berichtje in [Issues](https://github.com/johancoppens/smartschool-client/issues).

Een praktisch voorbeeld kan je vinden hier vinden: https://github.com/johancoppens/smartschool2gsheet

## API

Vind je hier: [API](api.md) en [voorbeelden](./examples).

## Vereisten

* Installatie [Node.js](https://nodejs.org/en/) versie +v8.
* Activeren van de Smartschool API in Algemene instellingen > Webservices. Maak daar bij voorkeur een aangepast profiel aan.

## Installeren / Gebruik

### Methode 1: Clonen van Github

Deze methode is handig om de module te verkennen en de verschillende voorbeelden in de examples directory uit te proberen. Als je wilt meewerken om deze module uit te breiden of te verbeteren dan is dit ook de beste keuze.

Als je git niet hebt geïnstalleerd, kan je de code eventueel ook als zip-file downloaden van de github page.

```bash
$ git clone https://github.com/johancoppens/smartschool-client.git
$ cd smartschool-client
$ npm install
```

> Opgelet: Eerst examples/config.template.js hernoemen naar config.js en aanpassen naar de instellingen van je eigen Smartschool platform.

Het is aan te raden om eerst [create_sample_data.js](./examples/create_sample_data.js) in de examples directory uitvoeren om
je Smartschool platform te voorzien van voorbeeld data. Dan is er ook geen gevaar dat je gegevens van bestaande gebruikers ongewild gaat wijzigen.

```bash
$ cd examples
$ node create_sample_data.js
```

Uitvoeren voorbeelden

```bash
$ node 00_get_user.js
...
```

Alle voorbeelden vind je hier: [Examples](./examples/)

Output van de voorbeeld-scripts kan je raadplegen in examples/out/

### Methode 2: Installeren met npm voor gebruik in een eigen project

In je eigen project directory, run:

```bash
$ npm install --save github:johancoppens/smartschool-client
```

## Nieuw!: sendMessage

Berichten verzenden naar alle gebruikers in een CSV in 30 lijnen! :-)

```javascript
// Smartschool berichten verzenden vanuit een CSV file
// CSV met deze opmaak
// user,app-code
// jane.roe,UNC94QC
// john.doe,QH9TLF2
const ss = require('smartschool-client')
const conf = require('./config')
const fs = require('fs')
const csvjson = require('csvjson')

const main = async () => {
  await ss.init(conf)

  const lln = csvjson.toObject(fs.readFileSync('./lln_demo.csv', { encoding: 'utf8' }))

  for (const ll of lln) {
    const title = `Welkom ${ll.voornaam}`
    const body = `
      <h3>Hallo ${ll.voornaam}</h3>
      <p>Hierbij je code om in te loggen op SuperNuperApp: ${ll['app-code']}
      <p>Veel succes!</p>   
    `
    try {
      await ss.sendMessage({
        userName: ll.user,
        title: title,
        body: body,
        fromUser: 'noreply'
      })
    } catch (e) {
      console.log(e)
    }
  }
  console.log('Done')
}
main()

```

## Eenvoudig gebruik:

```javascript
// Import SmartSchool client
const ss = require('smartschool-client')

const main = async () => {
  try {
    // Initialiseer configuratie
    await ss.init({
      apiWSDL: 'https://<jouwschool>.smartschool.be/Webservices/V3?wsdl',
      accessCode: '<jouw_api_access_code>'
    })

    // Aanspreken van een smartschool-client functie
    const users = await ss.getUsers({
      groupId: 'demoGroup1'
    })

    // users is een array met gebruikers
    // Doe iets met users, je eigen werk begint hier
    // ...

  } catch (e) {
    console.log(e)
  }
  console.log('Done')
}
main()

```

## Transformeren data

Je kan de output van velden "transformeren" met de transformation option. Gebruik het om velden te hernoemen en berekende velden te maken.

```javascript
// Een options object met transformation kan er zo uitzien
const options = {
  userId: 'john.doe',
  transformation: {
    name: 'voornaam', // Hernoemen velden
    userName: 'gebruikersnaam',
    internalNumber: 'internnummer',
    helloName: (obj) => { // Calculated field
      return `Hello ${obj.voornaam} ${obj.naam}!`
    }
  }
}

// Outputs
{
  name: 'John',
  userName: 'john.doe',
  internalNumber: 1234,
  helloName: 'Hello John Doe!'
}
```

## Advanced Example

```javascript
/**
 * Geavanceerd voorbeeld
 * Haalt alle gebruikers op in de groep demoGroup1
 * Vervolgens wordt voor elke gevonden gebruiker de foto opgehaald
 * en weggeschreven als gebruikersnaam.jpeg in de out directory
 */
// Import smartschool-client
const ss = require('smartschool-client')
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
      // Use the power of the transformation object! :-)
      transformation: {
        userName: 'gebruikersnaam',
        fileName: (user) => {
          return `${user.gebruikersnaam}.jpeg`
        }
      }
    })

    for (const user of users) {
      try {
        const photo = await ss.getUserPhoto({ userName: user.userName })
        await writeFile(`./out/${user.fileName}`, photo, 'base64')
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

## Opmerkingen

Het meegeven van de optie parent in de functie updateGroup heeft geen effect. De groep zal niet verplaats worden! Dit is geen bug, maar de huidige werking van de Smartschool API zelf.

## Gebruikte Stijl

De module is geschreven in de nieuwe async/await syntax (ES2017).

Alle code is volgens de [Javascript Standard Style](https://standardjs.com/).

Alle API functies aanvaarden één options parameter als object. Er wordt gebruik gemaakt van object destructing om waarden uit dit object te halen voor het gebruik in de functie. Naar mijn gevoel een elegante manier van werken zowel voor de ontwikkelaar van de functie, als voor de gebruiker ervan. Meer uitleg [hier](https://simonsmith.io/destructuring-objects-as-function-parameters-in-es6).
