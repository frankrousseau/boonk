Balance = require '../models/balance'

module.exports = class BalanceCollection extends Backbone.Collection

    model: Balance
    url: 'balances'

    constructor: (@view) ->
        super()

        @bind "add", @view.renderOne
        @bind "reset", @view.renderAll
