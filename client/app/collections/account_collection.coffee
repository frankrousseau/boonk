Account = require '../models/account'

module.exports = class AccountCollection extends Backbone.Collection

    model: Account
    url: 'accounts'

    constructor: (@view) ->
        super()

        @bind "add", @view.renderOne
        @bind "reset", @view.renderAll
