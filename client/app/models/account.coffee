module.exports = class Account extends Backbone.Model

    rootUrl: 'accounts'

    initialize: ->

    isNew: () ->
        not @id?
