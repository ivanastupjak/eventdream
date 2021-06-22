'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      table.integer('organisation_id').unsigned().references('id').inTable('organisations').notNullable().onDelete('CASCADE')
    })
  }

  down () {
    this.table('events', (table) => {
      table.dropColumn('organisation_id')
    })
  }
}

module.exports = EventsSchema
