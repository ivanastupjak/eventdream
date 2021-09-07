'use strict'
const User = use('App/Models/User')

class GetUser {
  async handle(ctx, next) {

    const authHeader = ctx.auth.getAuthHeader()

    if (!authHeader) {
      return ctx.response.badRequest("Invalid Token")
    }

    let jwtData = await ctx.auth._verifyToken(authHeader)

    const user = await User.query().where('id', jwtData.uid).first()

    if (user && jwtData.data.type === "user") {
      ctx.user = user
    } else {
      return ctx.response.notFound("User not found")
    }

    await next()
  }
}

module.exports = GetUser
