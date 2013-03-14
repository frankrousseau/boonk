Client = require('request-json').JsonClient

sendError = (send, msg, code=500) ->
    send error: true, msg: msg, code


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
            sendError send, "Server error occured while retrieving data."
        else
            send bankAccounts

action 'create', ->
    data =
        bank: body.bank
        bankName: body.bankName
        login: body.login
    BankAccount.create data, (err, bankAccount) =>
        if err
            sendError send, "Server error while creating account.", 500
        else
            bankAccount.createAccount body, (err, account) =>
                if err
                    railway.logger.write err
                    bankAccount.delete ->
                        sendError send, "Server error while creating account."
                else
                    send bankAccount

action 'destroy', ->
    @bankAccount.destroyAccount (err) =>
        if !err || String(err) is "Error: The model doesn't have an account"
            @bankAccount.destroy (err) =>
                if err
                    railway.logger.write err
                    send error: 'Cannot destroy account', 500
                else
                    send success: 'Account succesfuly deleted'
        else
            railway.logger.write err
            send error: 'Cannot destroy account', 500

action 'balances', ->
    client = new Client 'http://localhost:9101/'
    balances = []

    loadBalances = (bankAccounts, callback) ->
        if bankAccounts?.length > 0
            bankAccount = bankAccounts.pop()
            bankAccount.getAccount (error, account) =>
                if error
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
                        if err or res.statusCode is 400
                            callback new Error "Can't get account balances."
                        else
                            for line in body[bankAccount.bank]
                                line.bank = bankAccount.bank
                                balances.push line
                            loadBalances bankAccounts, callback
        else
            callback()

    BankAccount.all (err, bankAccounts) ->
        if err
            railway.logger.write err
        else
            loadBalances bankAccounts, ->
                send balances
