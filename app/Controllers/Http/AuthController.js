'use strict'
const moment = use('moment')
const {validate, sanitize} = use('Validator')
const User = use('App/Models/User')
const Hash = use("Hash")
const Organisation = use('App/Models/Organisation')


class AuthController {
  //Test 2
  async registerUser({request, response}) {

    let registrationData = sanitize(request.post(), {
      email: "normalize_email"
    })

    const validation = await validate(registrationData, {
      email: "required|email",
      password: "required|min:8|confirmed",
      first_name: "required|min:3",
      last_name: "required|min:3",
      date_of_birth: "required|date"
    })

    if (validation.fails()) {
      return response.badRequest({
        _message: validation._errorMessages[0].message
      })
    }

    const check = await User
      .query()
      .where("email", registrationData.email).first()

    if (check) {
      return response.badRequest({
        _message: "User with provided email already exists!"
      })
    }

    const dateCheck = moment(new Date()).diff(registrationData.date_of_birth, 'y')

    if (dateCheck < 18) {
      return response.badRequest({
        _message: "Must be at least 18 years old to register!"
      })
    }

    delete registrationData.password_confirmation

    await User.create({
      ...registrationData
    })
    return response.ok({
      _message: "Registration successful!"
    })
  }

  async loginUser({request, response, auth}) {
    const loginData = sanitize(request.post(), {
      email: "normalize_email"
    })

    const validation = await validate(loginData, {
      email: "required",
      password: "required",
    })

    if (validation.fails()) {
      return response.badRequest({
        _message: validation._errorMessages[0].message
      })
    }

    const user = await User
      .query()
      .where("email", loginData.email).first()

    if (!user) {
      return response.badRequest({
        _message: "User with this email does not exist!"
      })
    }

    const passwordCheck = await Hash.verify(loginData.password, user.password)

    if (!passwordCheck) {
      return response.badRequest({
        _message: "Invalid password!"
      })
    }

    const accessToken = await auth.generate(user, {type: 'user'})

    return response.ok({
      user,
      accessToken: accessToken.token
    })
  }

  async registerOrganisation({request, response}) {

    const registerData = sanitize(request.post(), {
      email: "normalize_email"
    })
    const validation = await validate(registerData, {
      email: "required|email",
      password: "required|min:8|confirmed",
      organisation_name: "required|min:3",
      oib: "required|min:11|max:11",
      adress: "required",
      city: "required|min:3"
    })

    if (validation.fails()) {
      return response.badRequest({
        _message: validation._errorMessages[0].message
      })
    }

    const check = await Organisation
      .query()
      .where("email", registerData.email).first()

    if (check) {
      return response.badRequest({
        _message: "User with provided email already exists!"
      })
    }

    delete registerData.password_confirmation

    await Organisation.create({
      ...registerData
    })
    return response.ok({
      _message: "Registration successful!"
    })
  }

  async loginOrganisation({request, response, auth}) {
    const loginData = request.post()

    const validation = await validate(loginData, {
      oib: "required",
      password: "required",
    })

    if (validation.fails()) {
      return response.badRequest({
        _message: validation._errorMessages[0].message
      })
    }

    const organisation = await Organisation
      .query()
      .where("oib", loginData.oib).first()

    if (!organisation) {
      return response.badRequest({
        _message: "User with this oib does not exist!"
      })
    }

    const passwordCheck = await Hash.verify(loginData.password, organisation.password)

    if (!passwordCheck) {
      return response.badRequest({
        _message: "Invalid password!"
      })
    }

    const accessToken = await auth.generate(organisation, {type: "organisation"})

    return response.ok({
      organisation,
      accessToken: accessToken.token
    })
  }

}

module.exports = AuthController
