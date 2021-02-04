<a name="module_smartschool-client"></a>

## smartschool-client
De module smartschool-client voorziet een aantal functies die een subset van de
Smartschool SOAP API implementeren, met de focus op gebruikers en groepen/klassen.
Het biedt een zeer flexibele en vereenvoudigde manier om data uit Smartschool op
te halen met nodeJS.


* [smartschool-client](#module_smartschool-client)
    * _static_
        * [.init(options)](#module_smartschool-client.init) ⇒ <code>Promise</code>
        * [.getUser(options)](#module_smartschool-client.getUser) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.createUser(options)](#module_smartschool-client.createUser) ⇒ <code>Promise</code>
        * [.updateUser(options)](#module_smartschool-client.updateUser) ⇒ <code>Promise</code>
        * [.updateUserName(options)](#module_smartschool-client.updateUserName) ⇒ <code>Promise</code>
        * [.updateUserPassword(options)](#module_smartschool-client.updateUserPassword) ⇒ <code>Promise</code>
        * [.setUserStateActive(options)](#module_smartschool-client.setUserStateActive) ⇒ <code>Promise</code>
        * [.setUserStateInactive(options)](#module_smartschool-client.setUserStateInactive) ⇒ <code>Promise</code>
        * [.setUserStateAdministrative(options)](#module_smartschool-client.setUserStateAdministrative) ⇒ <code>Promise</code>
        * [.addUserToGroup(options)](#module_smartschool-client.addUserToGroup) ⇒ <code>Promise</code>
        * [.removeUserFromGroup(options)](#module_smartschool-client.removeUserFromGroup) ⇒ <code>Promise</code>
        * [.getUsers([options])](#module_smartschool-client.getUsers) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
        * [.getClasses([options])](#module_smartschool-client.getClasses) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
        * [.getGroup([options])](#module_smartschool-client.getGroup) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.getGroups([options])](#module_smartschool-client.getGroups) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> \| <code>Promise.&lt;Object&gt;</code>
        * [.createGroup(options)](#module_smartschool-client.createGroup) ⇒ <code>Promise</code>
        * [.updateGroup(options)](#module_smartschool-client.updateGroup) ⇒ <code>Promise</code>
        * [.getUserPhoto(userName)](#module_smartschool-client.getUserPhoto) ⇒ <code>Promise.&lt;string&gt;</code>
        * [.setUserPhoto(userName, photo)](#module_smartschool-client.setUserPhoto) ⇒ <code>Promise</code>
        * [.sendMessage(options)](#module_smartschool-client.sendMessage) ⇒ <code>Promise</code>
    * _inner_
        * [~SmartSchoolServiceError](#module_smartschool-client.SmartSchoolServiceError)
            * [new SmartSchoolServiceError(message, code)](#new_module_smartschool-client.SmartSchoolServiceError_new)
        * [~SOAPError](#module_smartschool-client.SOAPError)
            * [new SOAPError(message)](#new_module_smartschool-client.SOAPError_new)
        * [~SmartSchoolClientError](#module_smartschool-client.SmartSchoolClientError)
            * [new SmartSchoolClientError(message)](#new_module_smartschool-client.SmartSchoolClientError_new)

<a name="module_smartschool-client.init"></a>

### smartschool-client.init(options) ⇒ <code>Promise</code>
Initialiseren van de smartschool-client API module

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.apiWSDL | <code>string</code> | 'https://jouwschool.smartschool.be/Webservices/V3?wsdl' |
| options.accessCode | <code>string</code> | Code geconfigureerd in je SmartSchool platform in Algemene Configuratie > Webservices |

<a name="module_smartschool-client.getUser"></a>

### smartschool-client.getUser(options) ⇒ <code>Promise.&lt;Object&gt;</code>
Met deze methode kan je alle velden (behalve wachtwoorden en profielfoto)
en de groepslidmaatschappen van een specifieke gebruiker ophalen.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**

- [./examples/00_get_user.js](./examples/00_get_user.js)
- [./examples/01_get_user_transform.js](./examples/01_get_user_transform.js)


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userId | <code>string</code> \| <code>number</code> | Gebruikersnaam of intern nummer gebruiker |
| [options.transformation] | <code>object</code> |  |

<a name="module_smartschool-client.createUser"></a>

### smartschool-client.createUser(options) ⇒ <code>Promise</code>
Voegt een nieuwe gebruiker toe.

Note: Niet alle mogelijke velden van
Smartschool zijn geïmplementeerd in deze functie.

Note2: De gebruiker wordt standaard toegevoegd aan de groep geconfigureerd
in de Webservices pagina van Smartschool in het veld doelgroep. Als je een
gebruiker aan een andere groep wilt toekennen, gebruik dan removeUserFromGroup
en vervolgens addUserToGroup om de gebruiker te verplaatsen.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/02_create_user.js](./examples/02_create_user.js)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.userName | <code>string</code> |  | Gebruikersnaam |
| options.password | <code>string</code> |  | Paswoord |
| options.firstName | <code>string</code> |  | Voornaam |
| options.lastName | <code>string</code> |  | Achternaam |
| options.registrationNumber | <code>string</code> |  | stamboeknummer |
| [options.internalNumber] | <code>string</code> |  | Intern nummer |
| [options.gender] | <code>string</code> | <code>&quot;m&quot;</code> | Geslacht |
| [options.role] | <code>string</code> | <code>&quot;andere&quot;</code> | Basisrol |
| [options.birthDate] | <code>string</code> |  | Geboortedatum. Formaat YYYY-MM-DD of DD-MM-YYYY |
| [options.email] | <code>string</code> |  | E-mail adres |

<a name="module_smartschool-client.updateUser"></a>

### smartschool-client.updateUser(options) ⇒ <code>Promise</code>
Update een bestaande gebruiker.

Note 1: Niet alle mogelijke velden van
Smartschool zijn geïmplementeerd in deze functie.

Note 2: Voor update gebruikersnaam, zie updateUserName

Note 3: Voor update paswoord, zie updateUserPassword

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/03_update_user.js](./examples/03_update_user.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |
| [options.firstName] | <code>string</code> | Voornaam |
| [options.lastName] | <code>string</code> | Achternaam |
| [options.internalNumber] | <code>string</code> | Intern nummer |
| [options.gender] | <code>string</code> | Geslacht |
| [options.role] | <code>string</code> | Basisrol |
| [options.birthDate] | <code>string</code> | Geboortedatum. Formaat YYYY-MM-DD of DD-MM-YYYY |
| [options.email] | <code>string</code> | E-mail adres |

<a name="module_smartschool-client.updateUserName"></a>

### smartschool-client.updateUserName(options) ⇒ <code>Promise</code>
Update gebruikersnaam. Kan alleen als er een intern nummer is ingevuld in Smartschool.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/04_update_user_name.js](./examples/04_update_user_name.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.internalNumber | <code>string</code> | Intern nummer |
| options.newUserName | <code>string</code> | Nieuwe gebruikersnaam |

<a name="module_smartschool-client.updateUserPassword"></a>

### smartschool-client.updateUserPassword(options) ⇒ <code>Promise</code>
Update paswoorden Hoofd- en co-accounts gebruiker.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/05_update_user_password.js](./examples/05_update_user_password.js)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.userName | <code>string</code> |  | Gebruikersnaam |
| options.password | <code>string</code> |  | Nieuw paswoord |
| [options.accountType] | <code>number</code> | <code>0</code> | Accounttype:'0' = hoofdaccount, '1' = co-account 1 of '2' = co-account 2 ...) |

<a name="module_smartschool-client.setUserStateActive"></a>

### smartschool-client.setUserStateActive(options) ⇒ <code>Promise</code>
Zet de status van een gebruiker op actief

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/06_set_user_state.js](./examples/06_set_user_state.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |

<a name="module_smartschool-client.setUserStateInactive"></a>

### smartschool-client.setUserStateInactive(options) ⇒ <code>Promise</code>
Zet de status van een gebruiker op inactief

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/06_set_user_state.js](./examples/06_set_user_state.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |

<a name="module_smartschool-client.setUserStateAdministrative"></a>

### smartschool-client.setUserStateAdministrative(options) ⇒ <code>Promise</code>
Zet de status van een gebruiker op administratief

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/06_set_user_state.js](./examples/06_set_user_state.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |

<a name="module_smartschool-client.addUserToGroup"></a>

### smartschool-client.addUserToGroup(options) ⇒ <code>Promise</code>
Voegt een gebruiker toe aan een groep of klas.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/07_user_group.js](./examples/07_user_group.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |
| options.groupOrClassId | <code>string</code> | Groep of klas code |

<a name="module_smartschool-client.removeUserFromGroup"></a>

### smartschool-client.removeUserFromGroup(options) ⇒ <code>Promise</code>
Verwijdert een gebruiker uit een groep of klas.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/07_user_group.js](./examples/07_user_group.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.userName | <code>string</code> | Gebruikersnaam |
| options.groupOrClassId | <code>string</code> | Groep of klas code |

<a name="module_smartschool-client.getUsers"></a>

### smartschool-client.getUsers([options]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Haalt alle unieke gebruikers van het platform op met alle beschikbare velden.
Als de groepCode is opgegegeven, worden enkel de gebruikers van deze groep opgehaald.
De groepen waartoe de gebruiker behoort kan je vinden in het veld groups als een Array van strings

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**

- [./examples/08_get_users.js](./examples/08_get_users.js)
- [./examples/09_get_users_in_group.js](./examples/09_get_users_in_group.js)
- [./examples/10_get_users_in_group_transform.js](./examples/10_get_users_in_group_transform.js)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> |  |
| [options.groupId] | <code>string</code> |  | Unieke klas- of groepscode van de op te halen groep |
| [options.recursive] | <code>bool</code> | <code>true</code> | Subgroepen ophalen? |
| [options.transformation] | <code>object</code> |  |  |

<a name="module_smartschool-client.getClasses"></a>

### smartschool-client.getClasses([options]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code>
Haalt een lijst met alle klassen op.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/11_get_classes.js](./examples/11_get_classes.js)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> | 
| [options.transformation] | <code>object</code> |  | 

<a name="module_smartschool-client.getGroup"></a>

### smartschool-client.getGroup([options]) ⇒ <code>Promise.&lt;Object&gt;</code>
Haalt een groep of klas op uit het Smartschoolplatform.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/12_get_group.js](./examples/12_get_group.js)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> |  |
| options.groupOrClassId | <code>string</code> |  | // group/class code |
| [options.transformation] | <code>object</code> |  |  |

<a name="module_smartschool-client.getGroups"></a>

### smartschool-client.getGroups([options]) ⇒ <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> \| <code>Promise.&lt;Object&gt;</code>
Haalt alle groepen en klassen van het Smartschoolplatform.
Als options.flat=false wordt er een object als boomstructuur geretourneerd.
options.transformation is niet ondersteund in dit geval.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**Returns**: <code>Promise.&lt;Array.&lt;Object&gt;&gt;</code> \| <code>Promise.&lt;Object&gt;</code> - null als niet gevonden  
**See**

- [./examples/13_getGroups_flat.js](./examples/13_getGroups_flat.js)
- [./examples/14_getGroups_tree.js](./examples/14_getGroups_tree.js)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>object</code> | <code>{}</code> |  |
| [options.flat] | <code>boolean</code> | <code>true</code> |  |
| [options.groupId] | <code>string</code> |  | Als opgegeven: deze groep en alle children |
| [options.transformation] | <code>object</code> |  |  |

<a name="module_smartschool-client.createGroup"></a>

### smartschool-client.createGroup(options) ⇒ <code>Promise</code>
Voegt een nieuwe groep toe.

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/15_create_group.js](./examples/15_create_group.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.groupId | <code>string</code> | Groepsnaam of code |
| [options.description] | <code>string</code> | Omschrijving |
| [options.parent] | <code>string</code> | Unieke klas-of groepscode van parent groep. Op hoogste niveau als weggelaten. |
| [options.untis] | <code>string</code> | Koppelingsvelds schoolagenda |

<a name="module_smartschool-client.updateGroup"></a>

### smartschool-client.updateGroup(options) ⇒ <code>Promise</code>
Wijzigt een groep.

Note: Hiermee kan je geen groepen in de groepenstructuur verplaatsen!
Het wijzigen van de parent heeft geen effect. > vraag aan Smartschool team

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/16_update_group.js](./examples/16_update_group.js)  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.groupId | <code>string</code> | Groepsnaam of code |
| [options.description] | <code>string</code> | Omschrijving |
| [options.parent] | <code>string</code> | Unieke klas-of groepscode van parent groep. Op hoogste niveau als weggelaten. |
| [options.untis] | <code>string</code> | Koppelingsveld schoolagenda |

<a name="module_smartschool-client.getUserPhoto"></a>

### smartschool-client.getUserPhoto(userName) ⇒ <code>Promise.&lt;string&gt;</code>
Met deze methode kan je de foto van een gebruiker ophalen als base64
encoded string in jpeg formaat

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**: [./examples/17_get_user_photo.js](./examples/17_get_user_photo.js)  

| Param | Type | Description |
| --- | --- | --- |
| userName | <code>string</code> | Gebruikersnaam |

<a name="module_smartschool-client.setUserPhoto"></a>

### smartschool-client.setUserPhoto(userName, photo) ⇒ <code>Promise</code>
Met deze methode kan je de foto van een gebruiker uploaden naar Smartschool als base64
encoded string in jpeg formaat

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  

| Param | Type | Description |
| --- | --- | --- |
| userName | <code>string</code> | Gebruikersnaam |
| photo | <code>string</code> | Base64 encode string jpeg |

<a name="module_smartschool-client.sendMessage"></a>

### smartschool-client.sendMessage(options) ⇒ <code>Promise</code>
Via deze methode kan je een bericht naar de hoofdaccount of een co-account van een bepaalde gebruiker sturen. Het opgeven van de bijlage is optioneel.
CopyToLVS niet geïmplementeerd
Attachements toevoegen
[
  { “filename”: “test1.docx”, “filedata”: “base64encoded string” },
  { “filename”: “test2.docx”, “filedata”: “base64encoded string” }
]

**Kind**: static method of [<code>smartschool-client</code>](#module_smartschool-client)  
**See**

- [./examples/19_send_message.js](./examples/19_send_message.js)
- [./examples/20_send_message_attachments.js](./examples/20_send_message_attachments.js)


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.userName | <code>string</code> |  | Gebruikersnaam |
| options.title | <code>string</code> |  | Titel van het bericht |
| options.body | <code>string</code> |  | Tekst van het bericht |
| [options.fromUser] | <code>string</code> | <code>&quot;&#x27;Null&#x27;&quot;</code> | Uniek veld gebruiker van de verzender. Geef 'Null' mee om geen verzender in te stellen |
| [options.accountType] | <code>number</code> | <code>0</code> | Accounttype:'0' = hoofdaccount, '1' = co-account 1 of '2' = co-account 2 ...) |
| [options.attachments] | <code>Array.&lt;Object&gt;</code> | <code>[]</code> | Bijlagen (1 of meer) in base64 encoding (optioneel) |

<a name="module_smartschool-client.SmartSchoolServiceError"></a>

### smartschool-client~SmartSchoolServiceError
Custom Error class die een error van de Smartschool service representeert

**Kind**: inner class of [<code>smartschool-client</code>](#module_smartschool-client)  
<a name="new_module_smartschool-client.SmartSchoolServiceError_new"></a>

#### new SmartSchoolServiceError(message, code)
Constructor


| Param | Type |
| --- | --- |
| message | <code>string</code> | 
| code | <code>string</code> \| <code>number</code> | 

<a name="module_smartschool-client.SOAPError"></a>

### smartschool-client~SOAPError
Custom Error class die een SOAP error representeert

**Kind**: inner class of [<code>smartschool-client</code>](#module_smartschool-client)  
<a name="new_module_smartschool-client.SOAPError_new"></a>

#### new SOAPError(message)
Constructor


| Param | Type |
| --- | --- |
| message | <code>string</code> | 

<a name="module_smartschool-client.SmartSchoolClientError"></a>

### smartschool-client~SmartSchoolClientError
Smartschool-client error

**Kind**: inner class of [<code>smartschool-client</code>](#module_smartschool-client)  
<a name="new_module_smartschool-client.SmartSchoolClientError_new"></a>

#### new SmartSchoolClientError(message)
Constructor


| Param | Type |
| --- | --- |
| message | <code>string</code> | 

