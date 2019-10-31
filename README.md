# smartschool-client

Deze module voorziet een aantal functies die een subset van de
Smartschool SOAP API implementeren in [Node.js](https://nodejs.org/en/).
De focus ligt op het ophalen van gegegevens van gebruikers en groepen/klassen (data pull).

Gecombineerd met bvb [node-cron](https://github.com/node-cron/node-cron) zou je hiermee in staat moeten zijn je eigen geautomatiseerde synchronisatie toepassing voor je school te maken.

Een voorbeeld-toepassing voor het synchroniseren van Smartschool data met een lokale database is in de maak ... stay tuned!

Waarom zou je deze module gebruiken?

Veel complex werk zoals afhandelen SOAP requests, parsen resultaten, opkuisen en omvormen van data, ... wordt voor jou achter de schermen gedaan zodat jij je kan focussen op het echte werk.

Alle functies retourneren pure javascript values. Je hoeft je niet meer bezig te houden met het parsen van JSON of XML strings en dergelijke.

De kracht van het transformation object: Je kan een tranformation object doorgeven aan de meeste functies die data ophalen. smartschool-client zal elke rij/object die terugkomt uit de API door deze transformatie halen, zodat het uiteindelijke resultaat eruit ziet zoals jij het wilt. Hiermee kan je velden selecteren en hernoemen. Als je een transformatiefunctie meegeeft kan je zelfs geheel nieuwe velden maken die het resultaat zijn van een berekening of combinatie van andere velden (calculated fields).

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

smartschool-client biedt je ook een duidelijke en goed gedocumenteerde [API](api.md) met tal van [voorbeelden](./examples).

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

Basic usage:

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

Als je een gebruiker manueel toevoegt in gebruikersbeheer van Smartschool, werkt het achteraf updaten van de paswoorden met de functie updateUserPassword van de co-accounts niet. Ik kan niet achterhalen hoe dit komt. De vraag is gesteld aan het Smartschool team.

## Gebruikte Stijl

De module is geschreven in de nieuwe async/await syntax (ES2017).

Alle code is volgens de [Javascript Standard Style](https://standardjs.com/).

Alle API functies aanvaarden één options parameter als object. Er wordt gebruik gemaakt van object destructing om waarden uit dit object te halen voor het gebruik in de functie. Naar mijn gevoel een elegante manier van werken zowel voor de ontwikkelaar van de functie, als voor de gebruiker ervan. Meer uitleg [hier](https://simonsmith.io/destructuring-objects-as-function-parameters-in-es6).
