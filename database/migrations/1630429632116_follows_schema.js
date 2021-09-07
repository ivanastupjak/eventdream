'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowsSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.integer('organisation_id').unsigned().references('id').inTable('organisations').notNullable().onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowsSchema
