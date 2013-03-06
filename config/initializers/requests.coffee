all = ->
    emit doc.title, doc
BankAccount.defineRequest "all", all, (err) ->
    if err
        railway.logger.write "Bookmark All requests, cannot be created"
        railway.logger.write err
