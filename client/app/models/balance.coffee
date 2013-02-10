reversed_banks = require('../lib/banks').reversed_banks

module.exports = class Balance extends Backbone.Model

    rootUrl: 'balances'

    initialize: ->
        @set "bankName", reversed_banks[@get "bank"]

    isNew: () ->
        not @id?
