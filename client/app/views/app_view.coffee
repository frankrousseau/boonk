View = require '../lib/view'
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
        @accountsView = new AccountsView()
        @balancesView = new BalancesView()
        
        @accountsView.$el.html '<em>loading...</em>'
        @accountsView.collection.fetch
            success: => @accountsView.$el.find('em').remove()

    onCreateClicked: =>
        bank = $('.bank-field').val()
        login = $('.login-field').val()
        password = $('.password-field').val()

        if bank?.length > 0 and login?.length > 0 and password?.length > 0
            account = new Account
                bank: bank
                login: login
                password: password
            @accountsView.collection.create account,
                success: => alert "account added"
                error: => alert "Server error occured, account was not saved"
        else
            alert 'Both fields are required'

    onBalanceClicked: =>
        @balancesView.clear()
        @balancesView.$el.html '<em>loading...</em>'
        @balancesView.collection.fetch
            success: => @balancesView.$el.find('em').remove()
