View = require '../lib/view'

module.exports = class AccountView extends View
    className: 'account'
    tagName: 'div'

    events:
        'click .delete-button': 'onDeleteClicked'

    constructor: (@model) ->
        super()

    template: ->
        template = require './templates/account'
        template @getRenderData()

    onDeleteClicked: ->
        @$('.delete-button').html "suppression..."
        @model.destroy
            success: => @destroy()
            error: =>
                alert "Server error occured, account was not deleted."
                @$('.delete-button').html "delete"
