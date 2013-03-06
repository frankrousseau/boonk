View = require '../lib/view'
banks = require('../lib/banks').banks
AppRouter = require '../routers/app_router'
AccountsView = require './accounts_view'
Account = require '../models/account'
BalancesView = require './balances_view'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        'click .create-button': 'onCreateClicked'
        'click .balance-button': 'onBalanceClicked'

    template: ->
        require './templates/home'

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    afterRender: ->
        @$(".dropdown-menu a").click ->
            $(".dropdown-toggle").html $(@).html()

        @accountsView = new AccountsView()
        @balancesView = new BalancesView()

        @accountsView.$el.html '<em>chargement...</em>'
        @accountsView.collection.fetch
            success: => @accountsView.$el.find('em').remove()
        @onBalanceClicked()

    onCreateClicked: =>
        bank = $('.bank-field').html()
        bank = banks[bank]
        login = $('.login-field').val()
        password = $('.password-field').val()

        if bank?.length > 0 and login?.length > 0 and password?.length > 0
            account = new Account
                bank: bank
                login: login
                password: password
            @accountsView.collection.create account,
                success: =>
                    @onBalanceClicked()
                error: => alert "Server error occured, account was not saved"
        else
            alert "Tous les champs doivent être remplis"


    onBalanceClicked: =>
        @balancesView.clear()
        @balancesView.$el.html '<em>loading...</em>'
        @balancesView.collection.fetch
            success: => @balancesView.$el.find('em').remove()
