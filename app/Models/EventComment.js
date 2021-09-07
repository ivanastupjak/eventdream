'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class EventComment extends Model {
  static boot(){
    super.boot()
    this.addTrait("Paginable")
  }

  event(){
    return this.belongsTo('App/Models/Event')
  }

  user(){
    return this.belongsTo('App/Models/User')
  }
}

module.exports = EventComment
