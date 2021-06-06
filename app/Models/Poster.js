'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Poster extends Model {
  static boot(){
    super.boot()
  }

  event(){
    return this.belongsTo("App/Models/Event")
  }
}

module.exports = Poster
