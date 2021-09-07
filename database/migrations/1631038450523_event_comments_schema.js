'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventCommentsSchema extends Schema {
  up () {
    this.create('event_comments', (table) => {
      table.increments()
      table.integer('event_id').unsigned().references('events.id').notNullable().onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')
      table.string('comment').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('event_comments')
  }
}

module.exports = EventCommentsSchema
