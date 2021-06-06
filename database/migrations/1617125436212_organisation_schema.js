'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrganisationSchema extends Schema {
  up () {
    this.create('organisations', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('organisation_name', 50).notNullable()
      table.string('oib',11).notNullable().unique()
      table.string('adress',50).notNullable()
      table.string('city',20).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('organisations')
  }
}

module.exports = OrganisationSchema
