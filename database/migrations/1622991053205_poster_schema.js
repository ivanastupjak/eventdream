'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PosterSchema extends Schema {
  up () {
    this.create('posters', (table) => {
      table.increments()
      table.integer("path",254).notNullable()
      table.integer("event_id").unsigned().references("id").inTable("events").notNullable().onDelete("cascade")
      table.timestamps()
    })
  }

  down () {
    this.drop('posters')
  }
}

module.exports = PosterSchema
