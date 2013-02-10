View = require '../lib/view'

module.exports = class BalanceView extends View
    className: 'balance'
    tagName: 'tr'

    constructor: (@model) ->
        super()

    template: ->
        template = require './templates/balance'
        template @getRenderData()
