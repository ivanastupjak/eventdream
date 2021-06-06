'use strict'

class Paginable {
  register(Model, customOptions = {}) {
    Model.queryMacro("paginable", function (pages, limit) {
      return this.paginate(pages ? pages : 1, limit ? limit : 10)
    })
  }
}

module.exports = Paginable
