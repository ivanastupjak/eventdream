'use strict'
const Organisation = use('App/Models/Organisation')

class GetOrganisation {

  async handle (ctx, next) {

    const authHeader=ctx.auth.getAuthHeader()

    if(!authHeader){
      return ctx.response.badRequest("Invalid Token")
    }

    let jwtData=await ctx.auth._verifyToken(authHeader)

    const organisation=await Organisation.query().where('id',jwtData.uid).first()

    if(organisation&&jwtData.data.type==="organisation"){
      ctx.organisation=organisation
    }

    else{
      return ctx.response.notFound("User not found")
    }

    await next()
  }
}

module.exports = GetOrganisation
