'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Event extends Model {
  static boot(){
    super.boot()
    this.addTrait("Paginable")
  }

  poster(){
    return this.hasOne("App/Models/Poster")
  }

  organisations(){
    return this.belongsTo("App/Models/Organisation",'organisation_id','id')
  }

  users(){
    return this.belongsToMany('App/Models/User').pivotModel('App/Models/EventUser')
  }

}

module.exports = Event
