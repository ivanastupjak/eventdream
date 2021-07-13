'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EventUser extends Model {

  event(){
    return this.belongsTo('App/Models/Event')
  }

  user(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = EventUser
