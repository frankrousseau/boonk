
Client = require('request-json').JsonClient

before ->
    BankAccount.find req.params.id, (err, bookmark) =>
        if err or !bookmark
            send error: true, msg: "Account not found", 404
        else
            @account = bookmark
            next()
, only: ['destroy']

action 'all', ->
     BankAccount.all (err, bookmarks) ->
        if err
            railway.logger.write err
            send error: true, msg: "Server error while creating account.", 500
        else
            send bookmarks

action 'create', ->
    data =
        bank: req.body.bank
        bankName: req.body.bankName
    BankAccount.create data, (err, account) =>
        account.createAccount req.body, (err, bookmark) =>
            if err
                railway.logger.write err
                send error: true, msg: "Server error while creating account.", 500
            else
                send account

action 'destroy', ->
    @account.destroyAccount (err) =>
        if err
            railway.logger.write err
            send error: 'Cannot destroy account', 500
        else
            @account.destroy (err) =>
                if err
                    railway.logger.write err
                    send error: 'Cannot destroy account', 500
                else
                    send success: 'Bookmark succesfuly deleted'

action 'balances', ->
    client = new Client 'http://localhost:9101/'
    balances = []

    loadBalances = (bankAccounts, callback) ->
        if bankAccounts.length > 0
            bankAccount = bankAccounts.pop()
            bankAccount.getAccount (error, account) =>
                    if error
                        callback err
                    else
                        path = "connectors/bank/#{account.bank}/"
                        client.post path, account, (err, res, body) ->
                            for line in body[account.bank]
                                line.bank = account.bank
                                balances.push line
                            loadBalances bankAccounts, callback
        else
            callback()

    BankAccount.all (err, bookmarks) ->
        if err
            railway.logger.write err
            send error: true, msg: "Server error while creating account.", 500
        else
            loadBalances bookmarks, ->
                send balances


