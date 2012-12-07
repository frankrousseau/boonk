ViewCollection = require '../lib/view_collection'
BalanceView  = require './balance_view'
BalanceCollection = require '../collections/balance_collection'

module.exports = class BalancesView extends ViewCollection
    el: '#balance-list'

    view: BalanceView

    initialize: ->
        @collection = new BalanceCollection @

    clear: ->
        @$el.html null
