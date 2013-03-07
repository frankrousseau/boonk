server = require './server'

deleteAll = (err, accounts) ->
    if accounts?.length > 0
        account = accounts.pop()
        account.deleteAccount ->
            account.delete ->
                callback null, accounts
    else
        console.log "All accounts are deleted"


BankAccount.all deleteAll
