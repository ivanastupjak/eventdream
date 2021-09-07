'use strict'
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organisation extends Model {
  static boot(){

    super.boot()

    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  followers(){
    return this.belongsToMany('App/Models/User').pivotModel('App/Models/Follow')
  }

}

module.exports = Organisation
