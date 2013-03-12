
Client = require('request-json').JsonClient

before ->
    BankAccount.find req.params.id, (err, bankAccount) =>
        if err or not bankAccount
            send error: true, msg: "Account not found", 404
        else
            @bankAccount = bankAccount
            next()
, only: ['destroy']

action 'all', ->
     BankAccount.all (err, bankAccounts) ->
        if err
            railway.logger.write err
            send error: true,  msg: "occured while retrieving data."
        else
            send bankAccounts

action 'create', ->
    data =
        bank: req.body.bank
        bankName: req.body.bankName
        login: req.body.login
    BankAccount.create data, (err, bankAccount) =>
        if err
            send error: true, "Server error while creating account.", 500
        else
            bankAccount.createAccount req.body, (err, account) =>
                if err
                    railway.logger.write err
                    send error: true, msg: "Server error while creating account.", 500
                else
                    send bankAccount

action 'destroy', ->
    @bankAccount.destroyAccount (err) =>
        if err
            railway.logger.write err
            send error: 'Cannot destroy account', 500
        else
            @bankAccount.destroy (err) =>
                if err
                    railway.logger.write err
                    send error: 'Cannot destroy account', 500
                else
                    send success: 'Account succesfuly deleted'

action 'balances', ->
    client = new Client 'http://localhost:9101/'
    balances = []

    loadBalances = (bankAccounts, callback) ->
        if bankAccounts.length > 0
            bankAccount = bankAccounts.pop()
            bankAccount.getAccount (error, account) =>
                if error
                    console.log String(error)
                    if String(error) is "Error: Data are corrupted"
                        bankAccount.destroyAccount (err) =>
                            if err
                                callback err
                            else
                                bankAccount.destroy (err) =>
                                    if err
                                        callback err
                                    else
                                        loadBalances bankAccounts, callback
                    else
                        console.log error
                        callback error
                else
                    path = "connectors/bank/#{bankAccount.bank}/"
                    client.post path, account, (err, res, body) ->
                        for line in body[account.bank]
                            line.bank = account.bank
                            balances.push line
                        loadBalances bankAccounts, callback
        else
            callback()

    BankAccount.all (err, bankAccounts) ->
        if err
            railway.logger.write err
            send error: true,  msg: "occured while retrieving data."
        else
            loadBalances bankAccounts, ->
                send balances


