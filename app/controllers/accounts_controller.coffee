Client = require('request-json').JsonClient

sendError = (send, msg, code=500) ->
    send error: true, msg: msg, code


before ->
    BankAccount.find req.params.id, (err, account) =>
        if err or !account
            sendError send, "Account not found", 404
        else
            @account = account
            next()
, only: ['destroy']

action 'all', ->
     BankAccount.all (err, accounts) ->
        if err
            railway.logger.write err
            sendError send, "Server error occured while retrieving data."
        else
            send accounts

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
                    send account

action 'destroy', ->
    @account.destroyAccount (err) =>
        # No need to stop the request here, if the account cannot be destroyed
        # most of the time, it means that the account does not exist.
        if err
            railway.logger.write err

        @account.destroy (err) =>
            if err
                railway.logger.write err
                send error: 'Cannot destroy account', 500
            else
                send success: 'Account succesfuly deleted'

action 'balances', ->
    client = new Client 'http://localhost:9101/'
    balances = []

    loadBalances = (bankAccounts, callback) ->
        if bankAccounts?.length > 0
            bankAccount = bankAccounts.pop()
            bankAccount.getAccount (err, account) =>
                if err
                    console.log err
                    callback err
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

    BankAccount.all (err, accounts) ->
        if err
            railway.logger.write err
        else
            loadBalances accounts, ->
                send balances
