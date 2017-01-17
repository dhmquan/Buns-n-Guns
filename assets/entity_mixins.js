Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },
  tryWalk: function (map,dx,dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());

    if(Game.Exit.isExit(targetX, targetY)){
      if(Game.Exit.isOpen()){
        // load next level
      }else{
        Game.Message.send("You need " + Game.Exit.attr.lockSize + " keys to open this door.");
      }
    }

    if (map.getEntity(targetX, targetY) == null && map.getTile(targetX,targetY).isWalkable()) {
      this.setPos(targetX,targetY);
      if (this.hasMixin('Chronicle')) { // NOTE: this is sub-optimal because it couple this mixin to the Chronicle one (i.e. this needs to know the Chronicle function to call) - the event system will solve this issue
        this.trackTurn();
      }

      return true;
    }
    return false;
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel:  {
      turnCounter: 0
    }
  },
  trackTurn: function () {
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function () {
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function (n) {
    this.attr._Chronicle_attr.turnCounter = n;
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    stateNamespace: '_HitPoints_attr',
    stateModel:  {
      maxHp: 1,
      curHp: 1
    },
    init: function (template) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;
    }
  },
  getMaxHp: function () {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function (n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function () {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function (n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function (amt) {
    this.attr._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function (amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt,this.attr._HitPoints_attr.maxHp);
  }
};

Game.EntityMixin.InventoryHolder = {
  META: {
    mixinName: 'InventoryHolder',
    mixinGroup: 'InventoryHolder',
    stateNamespace: '_InventoryHolder_attr',
    stateModel: {
      items: {},
      spaceAvailable: true
    },
    init: function (template) {
      this.attr._InventoryHolder_attr.items = template.items || {};
      this.attr._InventoryHolder_attr.spaceAvailable = template.spaceAvailable || true;
    }
  },

  hasSpace: function () {
    return this.attr._InventoryHolder_attr.spaceAvailable;
  },

  pickupItem: function (map,x,y) {
    var item = map.getItem(x, y);
    if ( item !== null) {
      this.attr._InventoryHolder_attr.items[item._itemID] = item;
      map.updateItem(item);
    }
    ;
  },

  getItem: function (itemId) {
    if (this.attr._InventoryHolder_attr.items[itemId]) {
      return Game.DATASTORE.ITEMS[itemId];
    }
    return null;
  },

  dropItem: function (itemId) {
    // var index = this.attr._InventoryHolder_attr.items.indexOf(itemId);
    // this.attr._InventoryHolder_attr.items.splice(index,1);
  }
};