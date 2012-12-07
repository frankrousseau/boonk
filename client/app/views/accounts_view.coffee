ViewCollection = require '../lib/view_collection'
AccountView  = require './account_view'
AccountCollection = require '../collections/account_collection'

module.exports = class AccountsView extends ViewCollection
    el: '#account-list'

    view: AccountView

    initialize: ->
        @collection = new AccountCollection @
