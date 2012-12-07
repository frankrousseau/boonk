module.exports = class Balance extends Backbone.Model

    rootUrl: 'balances'

    initialize: ->

    isNew: () ->
        not @id?
