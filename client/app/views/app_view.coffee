View = require '../lib/view'
AppRouter = require '../routers/app_router'
AccountsView = require './accounts_view'
Account = require '../models/account'
BalancesView = require './balances_view'

banks =
    "Axa Banque":"axabanque"
    "Banque Populaire":"banquepopulaire"
    "Barclays":"barclays"
    "BNP Paribas":"bnpporc"
    "Boursorama":"boursorama"
    "Banque Postale":"bp"
    "Bred":"bred"
    "Caisse d'Epargne":"caissedepargne"
    "Carrefour Banque":"carrefourbanque"
    "CIC":"cic"
    "Crédit Agricole":"cragr"
    "Credit Coopératif":"creditcooperatif"
    "Crédit Mutuel":"creditmutuel"
    "Crédit Mutuel Bretagne":"cmb"
    "Crédit Mutuel Sud Ouest":"cmso"
    "Fortuneo":"fortuneo"
    "Gan Assurances":"ganassurances"
    "HSBC":"hsbc"
    "ING":"ing"
    "LCL":"lcl"
    "Société Générale":"societegenerale"

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
        
        @accountsView.$el.html '<em>loading...</em>'
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
            alert 'Both fields are required'


    onBalanceClicked: =>
        @balancesView.clear()
        @balancesView.$el.html '<em>loading...</em>'
        @balancesView.collection.fetch
            success: => @balancesView.$el.find('em').remove()
