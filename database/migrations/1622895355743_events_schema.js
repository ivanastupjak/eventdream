'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventsSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments()
      table.string('name', 60).notNullable()
      table.string('description', 1000)
      table.string('place_of_event',50).notNullable()
      table.dateTime('start_of_event').notNullable()
      table.dateTime('end_of_event').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventsSchema
