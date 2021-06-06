'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  static boot(){
    super.boot()
    this.addTrait("Paginable")
  }

  poster(){
    this.hasOne("App/Models/Poster")
  }
}

module.exports = Event
