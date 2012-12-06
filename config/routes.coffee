exports.routes = (map) ->

    map.get 'accounts', 'accounts#all'
    map.post 'accounts', 'accounts#create'
    map.del 'accounts/:id', 'accounts#destroy'
