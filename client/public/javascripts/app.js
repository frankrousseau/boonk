(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/account_collection": function(exports, require, module) {
  var Account, AccountCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Account = require('../models/account');

  module.exports = AccountCollection = (function(_super) {

    __extends(AccountCollection, _super);

    AccountCollection.prototype.model = Account;

    AccountCollection.prototype.url = 'accounts';

    function AccountCollection(view) {
      this.view = view;
      AccountCollection.__super__.constructor.call(this);
      this.bind("add", this.view.renderOne);
      this.bind("reset", this.view.renderAll);
    }

    return AccountCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"collections/balance_collection": function(exports, require, module) {
  var Balance, BalanceCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Balance = require('../models/balance');

  module.exports = BalanceCollection = (function(_super) {

    __extends(BalanceCollection, _super);

    BalanceCollection.prototype.model = Balance;

    BalanceCollection.prototype.url = 'balances';

    function BalanceCollection(view) {
      this.view = view;
      BalanceCollection.__super__.constructor.call(this);
      this.bind("add", this.view.renderOne);
      this.bind("reset", this.view.renderAll);
    }

    return BalanceCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.CozyApp) == null) {
    this.CozyApp = {};
  }

  if ((_ref1 = CozyApp.Routers) == null) {
    CozyApp.Routers = {};
  }

  if ((_ref2 = CozyApp.Views) == null) {
    CozyApp.Views = {};
  }

  if ((_ref3 = CozyApp.Models) == null) {
    CozyApp.Models = {};
  }

  if ((_ref4 = CozyApp.Collections) == null) {
    CozyApp.Collections = {};
  }

  $(function() {
    var AppView;
    require('../lib/app_helpers');
    CozyApp.Views.appView = new (AppView = require('views/app_view'));
    CozyApp.Views.appView.render();
    return Backbone.history.start({
      pushState: true
    });
  });
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                     group,groupCollapsed,groupEnd,info,log,markTimeline,\
                     profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
}});

window.require.define({"lib/view": function(exports, require, module) {
  var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'section';

    View.prototype.template = function() {};

    View.prototype.initialize = function() {
      return this.render();
    };

    View.prototype.getRenderData = function() {
      var _ref;
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
      };
    };

    View.prototype.render = function() {
      this.beforeRender();
      this.$el.html(this.template());
      this.afterRender();
      return this;
    };

    View.prototype.beforeRender = function() {};

    View.prototype.afterRender = function() {};

    View.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return View;

  })(Backbone.View);
  
}});

window.require.define({"lib/view_collection": function(exports, require, module) {
  var View, ViewCollection, methods,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.renderAll = __bind(this.renderAll, this);

      this.renderOne = __bind(this.renderOne, this);
      return ViewCollection.__super__.constructor.apply(this, arguments);
    }

    ViewCollection.prototype.collection = new Backbone.Collection();

    ViewCollection.prototype.view = new View();

    ViewCollection.prototype.views = [];

    ViewCollection.prototype.length = function() {
      return this.views.length;
    };

    ViewCollection.prototype.add = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        if (!this.get(view.cid)) {
          this.views.push(view);
          if (!options.silent) {
            this.trigger('add', view, this);
          }
        }
      }
      return this;
    };

    ViewCollection.prototype.get = function(cid) {
      return this.find(function(view) {
        return view.cid === cid;
      }) || null;
    };

    ViewCollection.prototype.remove = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
        this.destroy(view);
        if (!options.silent) {
          this.trigger('remove', view, this);
        }
      }
      return this;
    };

    ViewCollection.prototype.destroy = function(view, options) {
      var _views;
      if (view == null) {
        view = this;
      }
      if (options == null) {
        options = {};
      }
      _views = this.filter(_view)(function() {
        return view.cid !== _view.cid;
      });
      this.views = _views;
      view.undelegateEvents();
      view.$el.removeData().unbind();
      view.remove();
      Backbone.View.prototype.remove.call(view);
      if (!options.silent) {
        this.trigger('remove', view, this);
      }
      return this;
    };

    ViewCollection.prototype.reset = function(views, options) {
      var view, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      _ref = this.views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        this.destroy(view, options);
      }
      if (views.length !== 0) {
        for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
          view = views[_j];
          this.add(view, options);
        }
        if (!options.silent) {
          this.trigger('reset', view, this);
        }
      }
      return this;
    };

    ViewCollection.prototype.renderOne = function(model) {
      var view;
      view = new this.view(model);
      this.$el.append(view.render().el);
      this.add(view);
      return this;
    };

    ViewCollection.prototype.renderAll = function() {
      this.collection.each(this.renderOne);
      return this;
    };

    return ViewCollection;

  })(View);

  methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  _.each(methods, function(method) {
    return ViewCollection.prototype[method] = function() {
      return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
    };
  });

  module.exports = ViewCollection;
  
}});

window.require.define({"models/account": function(exports, require, module) {
  var Account,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Account = (function(_super) {

    __extends(Account, _super);

    function Account() {
      return Account.__super__.constructor.apply(this, arguments);
    }

    Account.prototype.rootUrl = 'accounts';

    Account.prototype.initialize = function() {};

    Account.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Account;

  })(Backbone.Model);
  
}});

window.require.define({"models/balance": function(exports, require, module) {
  var Balance,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Balance = (function(_super) {

    __extends(Balance, _super);

    function Balance() {
      return Balance.__super__.constructor.apply(this, arguments);
    }

    Balance.prototype.rootUrl = 'balances';

    Balance.prototype.initialize = function() {};

    Balance.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Balance;

  })(Backbone.Model);
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': function() {}
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/account_view": function(exports, require, module) {
  var AccountView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = AccountView = (function(_super) {

    __extends(AccountView, _super);

    AccountView.prototype.className = 'account';

    AccountView.prototype.tagName = 'div';

    AccountView.prototype.events = {
      'click .delete-button': 'onDeleteClicked'
    };

    function AccountView(model) {
      this.model = model;
      AccountView.__super__.constructor.call(this);
    }

    AccountView.prototype.template = function() {
      var template;
      template = require('./templates/account');
      return template(this.getRenderData());
    };

    AccountView.prototype.onDeleteClicked = function() {
      var _this = this;
      this.$('.delete-button').html("deleting...");
      return this.model.destroy({
        success: function() {
          return _this.destroy();
        },
        error: function() {
          alert("Server error occured, account was not deleted.");
          return _this.$('.delete-button').html("delete");
        }
      });
    };

    return AccountView;

  })(View);
  
}});

window.require.define({"views/accounts_view": function(exports, require, module) {
  var AccountCollection, AccountView, AccountsView, ViewCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  AccountView = require('./account_view');

  AccountCollection = require('../collections/account_collection');

  module.exports = AccountsView = (function(_super) {

    __extends(AccountsView, _super);

    function AccountsView() {
      return AccountsView.__super__.constructor.apply(this, arguments);
    }

    AccountsView.prototype.el = '#account-list';

    AccountsView.prototype.view = AccountView;

    AccountsView.prototype.initialize = function() {
      return this.collection = new AccountCollection(this);
    };

    return AccountsView;

  })(ViewCollection);
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var Account, AccountsView, AppRouter, AppView, BalancesView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  AccountsView = require('./accounts_view');

  Account = require('../models/account');

  BalancesView = require('./balances_view');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.onBalanceClicked = __bind(this.onBalanceClicked, this);

      this.onCreateClicked = __bind(this.onCreateClicked, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.events = {
      'click .create-button': 'onCreateClicked',
      'click .balance-button': 'onBalanceClicked'
    };

    AppView.prototype.template = function() {
      return require('./templates/home');
    };

    AppView.prototype.initialize = function() {
      return this.router = CozyApp.Routers.AppRouter = new AppRouter();
    };

    AppView.prototype.afterRender = function() {
      var _this = this;
      this.accountsView = new AccountsView();
      this.balancesView = new BalancesView();
      this.accountsView.$el.html('<em>loading...</em>');
      return this.accountsView.collection.fetch({
        success: function() {
          return _this.accountsView.$el.find('em').remove();
        }
      });
    };

    AppView.prototype.onCreateClicked = function() {
      var account, bank, login, password,
        _this = this;
      bank = $('.bank-field').val();
      login = $('.login-field').val();
      password = $('.password-field').val();
      if ((bank != null ? bank.length : void 0) > 0 && (login != null ? login.length : void 0) > 0 && (password != null ? password.length : void 0) > 0) {
        account = new Account({
          bank: bank,
          login: login,
          password: password
        });
        return this.accountsView.collection.create(account, {
          success: function() {
            return alert("account added");
          },
          error: function() {
            return alert("Server error occured, account was not saved");
          }
        });
      } else {
        return alert('Both fields are required');
      }
    };

    AppView.prototype.onBalanceClicked = function() {
      var _this = this;
      this.balancesView.clear();
      this.balancesView.$el.html('<em>loading...</em>');
      return this.balancesView.collection.fetch({
        success: function() {
          return _this.balancesView.$el.find('em').remove();
        }
      });
    };

    return AppView;

  })(View);
  
}});

window.require.define({"views/balance_view": function(exports, require, module) {
  var BalanceView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = BalanceView = (function(_super) {

    __extends(BalanceView, _super);

    BalanceView.prototype.className = 'balance';

    BalanceView.prototype.tagName = 'div';

    function BalanceView(model) {
      this.model = model;
      BalanceView.__super__.constructor.call(this);
    }

    BalanceView.prototype.template = function() {
      var template;
      template = require('./templates/balance');
      return template(this.getRenderData());
    };

    return BalanceView;

  })(View);
  
}});

window.require.define({"views/balances_view": function(exports, require, module) {
  var BalanceCollection, BalanceView, BalancesView, ViewCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  BalanceView = require('./balance_view');

  BalanceCollection = require('../collections/balance_collection');

  module.exports = BalancesView = (function(_super) {

    __extends(BalancesView, _super);

    function BalancesView() {
      return BalancesView.__super__.constructor.apply(this, arguments);
    }

    BalancesView.prototype.el = '#balance-list';

    BalancesView.prototype.view = BalanceView;

    BalancesView.prototype.initialize = function() {
      return this.collection = new BalanceCollection(this);
    };

    BalancesView.prototype.clear = function() {
      return this.$el.html(null);
    };

    return BalancesView;

  })(ViewCollection);
  
}});

window.require.define({"views/templates/account": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="bank">' + escape((interp = model.bank) == null ? '' : interp) + '</div><div class="login">' + escape((interp = model.login) == null ? '' : interp) + '</div><button class="delete-button">delete</button>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/balance": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="bank">' + escape((interp = model.bank) == null ? '' : interp) + '</div><div class="label">' + escape((interp = model.label) == null ? '' : interp) + '</div><div class="balance">' + escape((interp = model.balance) == null ? '' : interp) + '</div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"> <h1>Boonk</h1><div id="create-account-form"><input placeholder="bank" class="bank-field"/><input placeholder="login" class="login-field"/><input placeholder="password" type="password" class="password-field"/><button class="btn create-button">create</button></div><div id="account-list"></div><button class="btn balance-button">display account balances</button><div id="balance-list"></div></div>');
  }
  return buf.join("");
  };
}});

