reversed_banks = require('../lib/banks').reversed_banks

module.exports = class Account extends Backbone.Model

    rootUrl: 'accounts'

    initialize: ->
        @set "bankName", reversed_banks[@get "bank"]

    isNew: () ->
        not @id?
