'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostersSchema extends Schema {
  up () {
    this.table('posters', (table) => {
      // alter table
      table.dropColumn('path')
    })
    this.table('posters',(table) =>{
      table.string('path').notNullable()
    })
  }

  down () {
    this.table('posters', (table) => {
      // reverse alternations
    })
  }
}

module.exports = PostersSchema
