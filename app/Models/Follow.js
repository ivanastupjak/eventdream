'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Follow extends Model {

  user(){
    return this.belongsTo('App/Models/User')
  }

  organisation(){
    return this.belongsTo('App/Model/Organisation')
  }
}

module.exports = Follow
