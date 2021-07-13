'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventUsersSchema extends Schema {
  up () {
    this.create('event_users', (table) => {
      table.increments()
      table.integer('event_id').unsigned().references('id').inTable('events').notNullable().onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('event_users')
  }
}

module.exports = EventUsersSchema
