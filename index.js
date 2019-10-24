/**
 * De module smartschool-client voorziet een aantal functies die een subset van de
 * Smartschool SOAP API implementeren, met de focus op gebruikers en groepen/klassen.
 * Het biedt een zeer flexibele en vereenvoudigde manier om data uit Smartschool op
 * te halen met nodeJS.
 * @module smartschool-client
 */

const soap = require('soap')
const xmlParse = require('xml2js').parseStringPromise
// const util = require('util')

module.exports = (function () {
  'use strict'

  let initialized = false
  let errorCodes = {}

  const config = {
    apiWSDL: null,
    accessCode: null
  }
  let soapClient = null

  /**
   * Initialiseren van de smartschool-client API module
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.apiWSDL 'https://jouwschool.smartschool.be/Webservices/V3?wsdl'
   * @param {string} options.accessCode Code geconfigureerd in je SmartSchool platform in Algemene Configuratie > Webservices
   * @returns {Promise}
   */
  const init = async ({ apiWSDL = r(), accessCode = r() } = {}) => {
    config.apiWSDL = apiWSDL
    config.accessCode = accessCode
    try {
      soapClient = await soap.createClientAsync(config.apiWSDL)
    } catch (err) {
      throw new SOAPError('createClientAsync')
    }
    initialized = true
    errorCodes = await getErrorCodes()
  }

  /**
   * Met deze methode kan je alle velden (behalve wachtwoorden en profielfoto)
   * en de groepslidmaatschappen van een specifieke gebruiker ophalen.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string|number} options.userId Gebruikersnaam of intern nummer gebruiker
   * @param {object} [options.transformation]
   * @returns {Promise<Object>}
   * @see {@link ./examples/00_get_user.js}
   * @see {@link ./examples/01_get_user_transform.js}
   */
  const getUser = async ({ userId = r(), transformation } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode
    }
    let res
    // Gebruikersnaam of intern nummer?
    if (isNaN(userId)) {
      params.username = userId
      res = await soapClient.getUserDetailsByUsernameAsync(params)
    } else {
      params.number = userId
      res = await soapClient.getUserDetailsByNumberAsync(params)
    }
    return handleJSONDataResponse(res, transformation)
  }

  /**
   * Voegt een nieuwe gebruiker toe.
   *
   * Note: Niet alle mogelijke velden van
   * Smartschool zijn geïmplementeerd in deze functie.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} options.password Paswoord
   * @param {string} options.firstName Voornaam
   * @param {string} options.surName Achternaam
   * @param {string} options.registrationNumber stamboeknummer
   * @param {string} [options.internalNumber] Intern nummer
   * @param {string} [options.gender = m] Geslacht
   * @param {string} [options.role = andere] Basisrol
   * @param {string} [options.birthDate] Geboortedatum. Formaat YYYY-MM-DD of DD-MM-YYYY
   * @param {string} [options.email] E-mail adres
   * @returns {Promise}
   * @see {@link ./examples/02_create_user.js}
   */
  // Om verwarring te voorkomen maken we een verschil tussen create en update
  const createUser = async ({
    userName = r(),
    password = r(),
    firstName = r(),
    surName = r(),
    registrationNumber, // stamboeknummer
    internalNumber, // intern nummer
    gender = 'm',
    role = 'andere',
    birthDate,
    email
  } = {}) => {
    // Eerst controleren of gebruiker al bestaat
    const user = await getUser({ userId: userName })
    if (user === null) {
      // Niet gevonden
      const params = {
        accesscode: config.accessCode,
        username: userName,
        passwd1: password,
        name: firstName,
        surname: surName,
        stamboeknummer: registrationNumber,
        internnumber: internalNumber,
        sex: gender,
        basisrol: role,
        birthday: birthDate,
        email: email
      }
      const res = await soapClient.saveUserAsync(params)
      handleResultCodeResponse(res)
    } else {
      e(`Error createUser, gebruiker ${userName} bestaat reeds`)
    }
  }

  /**
   * Update een bestaande gebruiker.
   *
   * Note 1: Niet alle mogelijke velden van
   * Smartschool zijn geïmplementeerd in deze functie.
   *
   * Note 2: Voor update gebruikersnaam, zie updateUserName
   *
   * Note 3: Voor update paswoord, zie updateUserPassword
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} [options.firstName] Voornaam
   * @param {string} [options.surName] Achternaam
   * @param {string} [options.internalNumber] Intern nummer
   * @param {string} [options.gender] Geslacht
   * @param {string} [options.role] Basisrol
   * @param {string} [options.birthDate] Geboortedatum. Formaat YYYY-MM-DD of DD-MM-YYYY
   * @param {string} [options.email] E-mail adres
   * @returns {Promise}
   * @see {@link ./examples/03_update_user.js}
   */
  // Om verwarring te voorkomen maken we een verschil tussen create en update
  const updateUser = async ({
    userName = r(),
    firstName,
    surName,
    gender,
    role,
    birthDate,
    email
  } = {}) => {
    // Eerst controleren of gebruiker bestaat
    const user = await getUser({ userId: userName })
    if (user) {
      const params = {
        accesscode: config.accessCode,
        username: userName,
        name: firstName,
        surname: surName,
        sex: gender,
        basisrol: role,
        birthday: birthDate,
        email: email
      }
      const res = await soapClient.saveUserAsync(params)
      return handleJSONDataResponse(res)
    } else {
      e(`Error updateUser, gebruiker ${userName} bestaat niet`)
    }
  }

  /**
   * Update gebruikersnaam. Kan alleen als er een intern nummer is ingevuld in Smartschool.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.internalNumber Intern nummer
   * @param {string} options.newUserName Nieuwe gebruikersnaam
   * @returns {Promise}
   * @see {@link ./examples/04_update_user_name.js}
   */
  const updateUserName = async ({ internalNumber = r(), newUserName = r() } = {}) => {
    const params = {
      accesscode: config.accessCode,
      internNumber: internalNumber,
      newUsername: newUserName
    }
    const res = await soapClient.changeUsernameAsync(params)
    return handleJSONDataResponse(res)
  }

  /**
   * Update paswoord gebruiker.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} options.password Nieuw paswoord
   * @param {number} [options.accountType = 0] Accounttype:'0' = hoofdaccount, '1' = co-account 1 of '2' = co-account 2 ...)
   * @returns {Promise}
   * @see {@link ./examples/05_update_user_password.js}
   */
  const updateUserPassword = async ({
    userName = r(),
    password = r(),
    accountType = 0
  } = {}) => {
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName,
      password: password,
      accountType: accountType
    }
    const res = await soapClient.savePasswordAsync(params)
    return handleJSONDataResponse(res)
  }

  /**
   * Zet de status van een gebruiker op actief
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @returns {Promise}
   * @see {@link ./examples/06_set_user_state.js}
   */
  const setUserStateActive = async ({ userName = r() } = {}) => {
    await setUserState({ userName: userName, state: 'active' })
  }

  /**
   * Zet de status van een gebruiker op inactief
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @returns {Promise}
   * @see {@link ./examples/06_set_user_state.js}
   */
  const setUserStateInactive = async ({ userName = r() } = {}) => {
    await setUserState({ userName: userName, state: 'inactive' })
  }

  /**
   * Zet de status van een gebruiker op administratief
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @returns {Promise}
   * @see {@link ./examples/06_set_user_state.js}
   */
  const setUserStateAdministrative = async ({ userName = r() } = {}) => {
    await setUserState({ userName: userName, state: 'administrative' })
  }

  /**
   * Voegt een gebruiker toe aan een groep of klas.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} options.groupOrClassId Groep of klas code
   * @returns {Promise}
   * @see {@link ./examples/07_user_group.js}
   */
  const addUserToGroup = async ({
    userName = r(),
    groupOrClassId = r()
  } = {}) => {
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName,
      class: groupOrClassId
    }
    const res = await soapClient.saveUserToClassAsync(params)
    handleResultCodeResponse(res)
  }

  /**
   * Verwijdert een gebruiker uit een groep of klas.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} options.groupOrClassId Groep of klas code
   * @returns {Promise}
   * @see {@link ./examples/07_user_group.js}
   */
  const removeUserFromGroup = async ({
    userName = r(),
    groupOrClassId = r()
  } = {}) => {
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName,
      class: groupOrClassId
    }
    const res = await soapClient.removeUserFromGroupAsync(params)
    handleResultCodeResponse(res)
  }

  /**
   * Haalt alle unieke gebruikers van het platform op met alle beschikbare velden.
   * Als de groepCode is opgegegeven, worden enkel de gebruikers van deze groep opgehaald.
   * De groepen waartoe de gebruiker behoort kan je vinden in het veld groups als een Array van strings
   * @memberof module:smartschool-client
   * @param {object} [options = {}]
   * @param {string} [options.groupId] Unieke klas- of groepscode van de op te halen groep
   * @param {bool} [options.recursive = true] Subgroepen ophalen?
   * @param {object} [options.transformation]
   * @returns {Promise<Array<Object>>}
   * @see {@link ./examples/08_get_users.js}
   * @see {@link ./examples/09_get_users_in_group.js}
   * @see {@link ./examples/10_get_users_in_group_transform.js}
   */
  const getUsers = async ({ groupId, recursive = true, transformation } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode,
      code: groupId || '', // '' voor alle gebruikers
      recursive: recursive ? 1 : 0
    }
    const res = await soapClient.getAllAccountsExtendedAsync(params)
    return handleJSONDataResponse(res, transformation)
  }

  /**
   * Haalt een lijst met alle klassen op.
   * @memberof module:smartschool-client
   * @param {object} [options = {}]
   * @param {object} [options.transformation]
   * @returns {Promise<Array<Object>>}
   * @see {@link ./examples/11_get_classes.js}
   */
  const getClasses = async ({ transformation } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode
    }
    const res = await soapClient.getClassListJsonAsync(params)
    return handleJSONDataResponse(res, transformation)
  }

  /**
   * Haalt een groep of klas op uit het Smartschoolplatform.
   * @memberof module:smartschool-client
   * @param {object} [options = {}]
   * @param {string} options.groupOrClassId // group/class code
   * @param {object} [options.transformation]
   * @returns {Promise<Object>}
   * @see {@link ./examples/12_get_group.js}
   */
  const getGroup = async ({ groupOrClassId = r(), transformation } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    let res = await getGroups()
    res = res.find((obj) => {
      if (obj.code === groupOrClassId) return obj
    })
    if (!res) return null
    return transformation ? transformObject(res, transformation) : res
  }

  /**
   * Haalt alle groepen en klassen van het Smartschoolplatform.
   * Als options.flat=false wordt er een object als boomstructuur geretourneerd.
   * options.transformation is niet ondersteund in dit geval.
   * @memberof module:smartschool-client
   * @param {object} [options = {}]
   * @param {boolean} [options.flat = true]
   * @param {object} [options.transformation]
   * @returns {Promise<Array<Object>>|Promise<Object>}
   * @see {@link ./examples/13_getGroups_flat.js}
   * @see {@link ./examples/14_getGroups_tree.js}
   */
  const getGroups = async ({ flat = true, transformation } = {}) => {
    if (transformation && flat === false) e('options.transformation is niet toegestaan als flat=false')
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode
    }
    const res = await soapClient.getAllGroupsAndClassesAsync(params)
    // result.return.$value is data als base64 encoded xml string. Parse into a js object
    const data = await xmlParse((Buffer.from(res[0].return.$value, 'base64').toString('utf-8')))
    if (typeof data === 'object') {
      if (flat) {
        if (transformation) {
          return transformArrayOfObjects(
            flattenTree(
              cleanTree(data.groups.group)),
            transformation
          )
        } else {
          return flattenTree(
            cleanTree(data.groups.group)
          )
        }
      } else {
        return cleanTree(data.groups.group)
      }
    }
    // Kan niet anders dan een Smartschool Service returncode
    const code = parseInt(data) // String en int door elkaar gebruikt in api
    if (code === 12) return null // Niet gevonden. Geen echte error, return null
    if (code !== 0) throw new SmartSchoolServiceError(errorCodes[code], code)
  }

  /**
   * Voegt een nieuwe groep toe.
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.groupId Groepsnaam of code
   * @param {string} [options.description] Omschrijving
   * @param {string} [options.parent] Unieke klas-of groepscode van parent groep. Op hoogste niveau als weggelaten.
   * @param {string} [options.untis] Koppelingsvelds schoolagenda
   * @returns {Promise}
   * @see {@link ./examples/15_create_group.js}
   */
  // Om verwarring te voorkomen maken we een verschil tussen create en update.
  // In smartschool-client worden de smartschool-velden
  // code en name vervangen door één veld groupId.
  const createGroup = async ({
    groupId = r(),
    description,
    parent,
    untis
  } = {}) => {
    // Eerst controleren of groep al bestaat
    const group = await getGroup({ groupOrClassId: groupId })
    if (group === null) {
      // Niet gevonden
      const params = {
        accesscode: config.accessCode,
        name: groupId,
        desc: description,
        code: groupId,
        parent: parent,
        untis: untis
      }
      const res = await soapClient.saveGroupAsync(params)
      handleResultCodeResponse(res)
    } else {
      e(`Error createGroup, groep ${groupId} bestaat reeds`)
    }
  }

  /**
   * Wijzigt een groep.
   *
   * Note: Hiermee kan je geen groepen in de groepenstructuur verplaatsen!
   * Het wijzigen van de parent heeft geen effect. > vraag aan Smartschool team
   * @memberof module:smartschool-client
   * @param {object} options
   * @param {string} options.groupId Groepsnaam of code
   * @param {string} [options.description] Omschrijving
   * @param {string} [options.parent] Unieke klas-of groepscode van parent groep. Op hoogste niveau als weggelaten.
   * @param {string} [options.untis] Koppelingsveld schoolagenda
   * @returns {Promise}
   * @see {@link ./examples/16_update_group.js}
   */
  // Om verwarring te voorkomen maken we een verschil tussen create en update.
  // In smartschool-client worden de smartschool-velden
  // code en name vervangen door één veld groupId.
  const updateGroup = async ({
    groupId = r(),
    description,
    parent,
    untis
  } = {}) => {
    // Eerst controleren of groep bestaat
    const group = await getGroup({ groupOrClassId: groupId })
    if (group !== null) {
      // Gevonden
      const params = {
        accesscode: config.accessCode,
        name: groupId,
        desc: description,
        code: groupId,
        parent: parent,
        untis: untis
      }
      const res = await soapClient.saveGroupAsync(params)
      handleResultCodeResponse(res)
    } else {
      e(`Error updateGroup, groep ${groupId} niet gevonden`)
    }
  }

  /**
   * Met deze methode kan je de foto van een gebruiker ophalen als base64
   * encoded string in jpeg formaat
   * @memberof module:smartschool-client
   * @param {string} userName Gebruikersnaam
   * @returns {Promise<string>}
   * @see {@link ./examples/17_get_user_photo.js}
   */
  const getUserPhoto = async ({ userName = r() } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName
    }
    const res = await soapClient.getAccountPhotoAsync(params)
    // We veronderstellen hier dat als res niet langer is dan 10 tekens,
    // de smartschool api een errorcode doorgeeft.
    if (res[0].return.$value.length < 10) {
      const code = res[0].return.$value
      throw new SmartSchoolServiceError(errorCodes[code], code)
    }
    return res[0].return.$value
  }

  /**
   * Met deze methode kan je de foto van een gebruiker uploaden naar Smartschool als base64
   * encoded string in jpeg formaat
   * @memberof module:smartschool-client
   * @param {string} userName Gebruikersnaam
   * @param {string} photo Base64 encode string jpeg
   * @returns {Promise}
   */
  const setUserPhoto = async ({ userName = r(), photo = r() } = {}) => {
    if (!initialized) e('Module smartschool-client niet geïnitialiseerd met init()')
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName,
      photo: photo
    }
    const res = await soapClient.setAccountPhotoAsync(params)
    handleResultCodeResponse(res)
  }

  // PRIVATE API FUNCTIONS
  // Non public exposed Smartschool api functions. Only privately used in this module

  /**
   * Deze methode haalt alle errorcodes op.
   * @returns {Promise<object>}
   */
  const getErrorCodes = async () => {
    const res = await soapClient.returnJsonErrorCodesAsync(null)
    return handleJSONDataResponse(res)
  }

  /**
   * Met deze methode kan de status van een gebruiker gewijzigd worden.
   * @param {object} options
   * @param {string} options.userName Gebruikersnaam
   * @param {string} options.state actief, inactief of administratief
   * @returns {Promise}
   */
  const setUserState = async ({
    userName = r(),
    state = r()
  } = {}) => {
    const params = {
      accesscode: config.accessCode,
      userIdentifier: userName,
      accountStatus: state
    }
    const res = await soapClient.setAccountStatusAsync(params)
    handleResultCodeResponse(res)
  }

  // CUSTOM ERROR CLASSES

  /**
   * Custom Error class die een error van de Smartschool service representeert
   * @class
   * @memberof module:smartschool-client
   */
  class SmartSchoolServiceError extends Error {
    /**
     * Constructor
     * @param {string} message
     * @param {string|number} code
     */
    constructor (message, code) {
      super(message)
      this.name = 'SmartSchoolServiceError'
      this.code = code
    }
  }

  /**
   * Custom Error class die een SOAP error representeert
   * @class
   * @memberof module:smartschool-client
   */
  class SOAPError extends Error {
    /**
     * Constructor
     * @param {string} message
     */
    constructor (message) {
      super(message)
      this.name = 'SOAPError'
    }
  }

  /**
   * Smartschool-client error
   * @class
   * @memberof module:smartschool-client
   */
  class SmartSchoolClientError extends Error {
    /**
     * Constructor
     * @param {string} message
     */
    constructor (message) {
      super(message)
      this.name = 'SmartSchoolClientError'
    }
  }

  // PRIVATE DATA HANDLING FUNCTIONS

  // Handles a JSON SOAP response that returns data
  const handleJSONDataResponse = (resp, transformation) => {
    const data = JSON.parse(resp[0].return.$value)
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return cleanArrayOfObjects(
          transformation ? transformArrayOfObjects(data, transformation) : data
        )
      } else {
        return cleanObject(
          transformation ? transformObject(data, transformation) : data
        )
      }
    }
    // Kan niet anders dan een Smartschool Service returncode
    const code = parseInt(data) // String en int door elkaar gebruikt in api
    if (code === 12) return null // Niet gevonden. Geen echte error, return null
    if (code !== 0) throw new SmartSchoolServiceError(errorCodes[code], code)
  }

  // Handles responses that perform an action
  const handleResultCodeResponse = (resp) => {
    const code = parseInt(JSON.parse(resp[0].return.$value)) // String en int door elkaar gebruikt in api
    if (code !== 0) throw new SmartSchoolServiceError(errorCodes[code], code)
  }

  const cleanArrayOfObjects = (src) => {
    return src.map((obj) => {
      return cleanObject(obj)
    })
  }

  // Clean values
  // Empty strings to null
  // ISO date strings to real Date objects
  const cleanObject = (obj) => {
    Object.keys(obj).forEach((fld) => {
      const val = obj[fld]
      // Dates like 2018-02-01
      if (RegExp('^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$').test(val)) {
        // Geen datum is 0000-00-00. Vervangen door null
        if (val === '0000-00-00') {
          obj[fld] = null
        } else {
          obj[fld] = new Date(val)
        }
      }
      // Login tijden volgens pattern 2018-02-03 20:24:47;2018-02-03 20:24:47
      // Bestaat in 2 delen gescheiden door ;
      // Tweede deel is laatste inlogtijd en is de tijd die wordt weergegeven in Smartschool
      // Eerste deel: voorlaatste keer ingelogd, of met mobiele app?
      // We nemen tweede deel
      // Als er nog nooit is ingelogd staat er enkel een ;. Dit vervangen we door null value
      if (RegExp(';([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9]) ([0-9][0-9]):([0-9][0-9]):([0-9][0-9])$').test(val)) {
        // extract last part after ;
        const dat = RegExp('([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9]) ([0-9][0-9]):([0-9][0-9]):([0-9][0-9])$').exec(val)[0].replace(' ', 'T')
        obj[fld] = new Date(dat)
      }
      // Nooit ingelogd
      if (val === ';') {
        obj[fld] = null
      }
      // Replace '' values with null
      if (val === '') {
        obj[fld] = null
      }
    })
    return obj
  }

  // Returns a new transformed array of transformed objects
  const transformArrayOfObjects = (src, transformation) => {
    return src.map((el) => {
      return transformObject(el, transformation)
    })
  }

  // Select and rename fields, and apply functions for calculated fields
  const transformObject = (obj, transformation) => {
    const newObj = {}
    Object.keys(transformation).forEach((tKey) => {
      if (typeof transformation[tKey] === 'function') {
        // apply the function on object
        newObj[tKey] = transformation[tKey](obj)
      } else {
        if (obj[transformation[tKey]] !== undefined) {
          newObj[tKey] = obj[transformation[tKey]]
        } else {
          newObj[tKey] = null
        }
      }
    })
    return newObj
  }

  const cleanTree = (src) => {
    return src.map(el => {
      return cleanTreeObj(el)
    })
  }
  const cleanTreeObj = (obj = {}) => {
    Object.entries(obj).map((entry) => {
      switch (entry[0]) {
        case 'children':
          obj[entry[0]] = entry[1][0].group.map(el => {
            return cleanTreeObj(el)
          })
          break
        case 'titu':
          obj[entry[0]] = entry[1][0].user.map(el => {
            return cleanTreeObj(el)
          })
          break
        default:
          switch (entry[1][0]) {
            case '':
              obj[entry[0]] = null
              break
            case '0':
              obj[entry[0]] = false
              break
            case '1':
              obj[entry[0]] = true
              break
            default:
              obj[entry[0]] = entry[1][0]
          }
      }
    })
    return obj
  }

  const flattenTree = (src) => {
    const flat = []
    src.forEach(el => {
      flattenTreeObj(el, flat)
    })
    return flat
  }

  const flattenTreeObj = (obj, flat) => {
    const newObj = {}
    Object.entries(obj).forEach((entry) => {
      const childrenAsStrings = []
      switch (entry[0]) {
        case 'children':
          obj[entry[0]].forEach((child) => {
            childrenAsStrings.push({ code: child.code, name: child.name })
            flattenTreeObj(child, flat)
          })
          newObj[entry[0]] = childrenAsStrings
          break
        default:
          newObj[entry[0]] = entry[1]
      }
    })
    flat.push(newObj)
  }

  // Utility shortcut functions
  // Parameter error func used if parameter is required
  const r = () => {
    e('Vereiste parameter is niet opgegeven')
  }
  // Shortcut for throwing an error
  const e = (message) => {
    throw new SmartSchoolClientError(message)
  }
  // Shortcut for console.log
  // const l = (v) => {
  //   console.log(util.inspect(v, { color: true, depth: null }))
  // }

  // Expose public API
  return {
    SmartSchoolServiceError,
    SOAPError,
    SmartSchoolClientError,
    init,
    getUser,
    getUsers,
    createUser,
    updateUser,
    updateUserName,
    updateUserPassword,
    setUserStateActive,
    setUserStateInactive,
    setUserStateAdministrative,
    addUserToGroup,
    removeUserFromGroup,
    getClasses,
    getGroup,
    getGroups,
    createGroup,
    updateGroup,
    getUserPhoto,
    setUserPhoto,
    transformArrayOfObjects
  }
}())
