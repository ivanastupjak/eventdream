'use strict'
const Follow = use('App/Models/Follow')
const Organisation = use('App/Models/Organisation')

class OrganisationController {

  async followUnFollow({response,params,user}){

    const organisation = await Organisation
      .query()
      .where('id',params.organisation_id)
      .first()

    if(!organisation){
      return response.notFound()
    }

    const alreadyFollowing = await Follow
      .query()
      .where('user_id',user.id)
      .where('organisation_id', params.organisation_id)
      .first()

    if(alreadyFollowing){
      await alreadyFollowing.delete()
    }else{
      await organisation.followers().attach([user.id])
    }

    return response.ok()
  }
}

module.exports = OrganisationController
