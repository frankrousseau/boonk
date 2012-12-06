before ->
    Account.find req.params.id, (err, bookmark) =>
        if err or !bookmark
            send error: true, msg: "Account not found", 404
        else
            @account = bookmark
            next()
, only: ['destroy']


action 'all', ->
    Account.all (err, bookmarks) ->
        if err
            railway.logger.write err
            send error: true, msg: "Server error occured while retrieving data."
        else
            send bookmarks

action 'create', ->
    Account.create req.body, (err, bookmark) =>
        if err
            railway.logger.write err
            send error: true, msg: "Server error while creating account.", 500
        else
            send bookmark

action 'destroy', ->
    @account.destroy (err) ->
        if err
            railway.logger.write err
            send error: 'Cannot destroy account', 500
        else
            send success: 'Bookmark succesfuly deleted'
