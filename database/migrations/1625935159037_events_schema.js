'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.table('events', (table) => {
      table.string('city',20).notNullable()
    })
  }

  down () {
    this.table('events', (table) => {
      table.dropColumn('city')
    })
  }
}

module.exports = EventsSchema
