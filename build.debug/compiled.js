var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.copy = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.add = function (vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
        return this;
    };
    Vector2.add = function (v1, v2) {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    };
    Vector2.prototype.equals = function (vector2) {
        return this.x == vector2.x && this.y == vector2.y;
    };
    Vector2.prototype.normal = function () {
        return new Vector2(Tools.normalize(this.x), Tools.normalize(this.y));
    };
    Object.defineProperty(Vector2, "zero", {
        get: function () {
            return new Vector2(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.toString = function () {
        return this.x.toFixed(2) + ':' + this.y.toFixed(2);
    };
    return Vector2;
}());
var Component = /** @class */ (function () {
    function Component(gameObject) {
        this.gameObject = gameObject;
    }
    Component.prototype.update = function (tic) { };
    return Component;
}());
/// <reference path="./../Component.ts" />
var Components;
(function (Components) {
    var Visible = /** @class */ (function (_super) {
        __extends(Visible, _super);
        function Visible() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = 14;
            _this.hide = false;
            return _this;
        }
        Visible.prototype.draw = function () {
            if (!this.hide) {
                var globalPosition = this.gameObject.getGlobalPosition();
                this.gameObject.game.api.rect(globalPosition.x, globalPosition.y, this.gameObject.dimensions.x, this.gameObject.dimensions.y, this.color);
                // if (this.gameObject.direction.x > 0) {
                //   this.gameObject.game.api.rect(globalPosition.x + this.gameObject.dimensions.x, globalPosition.y, Tools.normalize(this.gameObject.velocity.x), this.gameObject.dimensions.y, 11);
                // } else {
                //   this.gameObject.game.api.rect(globalPosition.x - Tools.normalize(Math.abs(this.gameObject.velocity.x)), globalPosition.y, Tools.normalize(Math.abs(this.gameObject.velocity.x)), this.gameObject.dimensions.y, 11);
                // }
                for (var _i = 0, _a = this.gameObject.childrenByComponent(ComponentFlags.Visible); _i < _a.length; _i++) {
                    var child = _a[_i];
                    child.components.visible.draw();
                }
            }
        };
        return Visible;
    }(Component));
    Components.Visible = Visible;
})(Components || (Components = {}));
/// <reference path="./Components/Visible.ts" />
var ComponentManager = /** @class */ (function () {
    function ComponentManager(gameObject, componentFlags) {
        if (componentFlags === void 0) { componentFlags = 0; }
        this.componentFlags = 0;
        this.componentFlags = componentFlags;
        this.visible = this.hasComponent(ComponentFlags.Visible) ? new Components.Visible(gameObject) : null;
        this.actor = this.hasComponent(ComponentFlags.Actor) ? new Components.Actor(gameObject) : null;
        this.solid = this.hasComponent(ComponentFlags.Solid) ? new Components.Solid(gameObject) : null;
    }
    ComponentManager.prototype.update = function (tic) {
        if (this.hasComponent(ComponentFlags.Visible)) {
            this.visible.update(tic);
        }
        if (this.hasComponent(ComponentFlags.Solid)) {
            this.solid.update(tic);
        }
        if (this.hasComponent(ComponentFlags.Actor)) {
            this.actor.update(tic);
        }
    };
    ComponentManager.prototype.hasComponent = function (componentFlag) {
        return (this.componentFlags & componentFlag) === componentFlag;
    };
    return ComponentManager;
}());
/// <reference path="./Vector2.ts" />
/// <reference path="./ComponentManager.ts" />
var RootGameObject = /** @class */ (function () {
    function RootGameObject(game, id, componentFlags) {
        this.children = [];
        this.states = {};
        this.position = Vector2.zero;
        this.dimensions = Vector2.zero;
        this.velocity = Vector2.zero;
        this.direction = new Vector2(1, 0);
        this.defaultVelocity = Vector2.zero;
        this.score = 0;
        this.tags = 0;
        this.game = game;
        this.id = id;
        this.components = new ComponentManager(this, componentFlags);
    }
    RootGameObject.prototype.onCollision = function (hitter) {
        throw new Error("Method not implemented.");
    };
    RootGameObject.prototype.getGlobalPosition = function () {
        return this.position;
    };
    RootGameObject.prototype.removeChild = function (child) {
        var childIndex = this.children.indexOf(child);
        this.children.splice(childIndex, 1);
    };
    RootGameObject.prototype.addChild = function (child) {
        child.parent = this;
        child.game = this.game;
        this.children.push(child);
    };
    RootGameObject.prototype.childrenByTag = function (tags) {
        var result = [];
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.hasTags(tags)) {
                result.push(child);
            }
        }
        return result;
    };
    RootGameObject.prototype.childrenByComponent = function (componentFlags) {
        var result = [];
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            if (child.components.hasComponent(componentFlags)) {
                result.push(child);
            }
        }
        return result;
    };
    RootGameObject.prototype.update = function (tic) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.update(tic);
        }
    };
    RootGameObject.prototype.draw = function () {
        if (this.components.hasComponent(ComponentFlags.Visible)) {
            this.components.visible.draw();
        }
    };
    RootGameObject.prototype.destroy = function () {
        throw new Error("Method not implemented.");
    };
    RootGameObject.prototype.reset = function () {
        this.children.length = 0;
    };
    RootGameObject.prototype.hasTags = function (tags) {
        return false;
    };
    RootGameObject.prototype.toString = function () {
        return this.id;
    };
    return RootGameObject;
}());
/// <reference path="./RootGameObject.ts" />
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    function GameObject(parent, id, componentFlags) {
        var _this = _super.call(this, parent.game, id, componentFlags) || this;
        parent.addChild(_this);
        return _this;
    }
    GameObject.prototype.onUpdate = function (tic) { };
    GameObject.prototype.onCollision = function (collidingObject) { };
    GameObject.prototype.onDestroy = function () { };
    GameObject.prototype.update = function (tic) {
        this.components.update(tic);
        this.onUpdate(tic);
        if (this.velocity.x > 0) {
            this.direction.x = 1;
        }
        else if (this.velocity.x < 0) {
            this.direction.x = -1;
        }
        if (this.velocity.y > 0) {
            this.direction.y = 1;
        }
        else if (this.velocity.y < 0) {
            this.direction.y = -1;
        }
        _super.prototype.update.call(this, tic);
        if (this.components.hasComponent(ComponentFlags.Solid)) {
            this.components.solid.collideWithSolid();
        }
        this.updatePosition();
    };
    GameObject.prototype.destroy = function () {
        this.parent.removeChild(this);
        this.onDestroy();
    };
    GameObject.prototype.getGlobalPosition = function () {
        var position = this.position.copy();
        var current = this;
        while (current.parent != null) {
            current = current.parent;
            position.add(current.position);
        }
        return position;
    };
    GameObject.prototype.updatePosition = function () {
        this.position.add(this.velocity);
    };
    GameObject.prototype.hasTags = function (tags) {
        return (this.tags & tags) === tags;
    };
    GameObject.prototype.toString = function () {
        return this.id;
    };
    return GameObject;
}(RootGameObject));
/// <reference path="./../rosetic/src/GameObject.ts" />
var BloodParticle = /** @class */ (function (_super) {
    __extends(BloodParticle, _super);
    function BloodParticle(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid) || this;
        _this.liveCounter = 50;
        _this.dimensions = new Vector2(2, 2);
        _this.components.visible.color = Tools.getRandomInt(10, 12);
        return _this;
    }
    BloodParticle.prototype.onUpdate = function (tic) {
        this.liveCounter -= 1;
        if (this.liveCounter <= 0) {
            this.destroy();
        }
        this.velocity.y = this.velocity.y + this.game.gravity;
        if (this.components.solid.grounded && Math.abs(this.velocity.x) > 0) {
            if (Math.abs(this.velocity.x) < 0.1) {
                this.velocity.x = 0;
            }
            else {
                this.velocity.x = (Math.abs(this.velocity.x) - 0.1) * Tools.normalize(this.velocity.x);
            }
        }
    };
    return BloodParticle;
}(GameObject));
var ComponentFlags;
(function (ComponentFlags) {
    ComponentFlags[ComponentFlags["None"] = 0] = "None";
    ComponentFlags[ComponentFlags["Visible"] = 1] = "Visible";
    ComponentFlags[ComponentFlags["Solid"] = 2] = "Solid";
    ComponentFlags[ComponentFlags["Actor"] = 4] = "Actor";
})(ComponentFlags || (ComponentFlags = {}));
/// <reference path="./ComponentFlags.ts" />
var BaseGame = /** @class */ (function () {
    function BaseGame(api) {
        this.hiScore = 0;
        this.gravity = 0;
        this.tic = 0;
        this.api = api;
        this.root = new RootGameObject(this, "_root", ComponentFlags.Visible);
        //this.performanceMonitor = new PerformanceMonitor(this);
    }
    BaseGame.prototype.setCurrentLevel = function (level) {
        level.init();
        this.currentLevel = level;
    };
    BaseGame.prototype.init = function () { };
    BaseGame.prototype.update = function (tic) {
        this.tic = tic;
        //this.performanceMonitor.frameStartTime = this.api.time();
        this.currentLevel.update(tic);
        //this.performanceMonitor.frameEndTime = this.api.time();
        //this.performanceMonitor.draw();
    };
    BaseGame.prototype.getGameObjectCollection = function (collectionId) {
        var collection = this._gameObjectCollections[collectionId];
        if (collection == undefined) {
            collection = [];
            this._gameObjectCollections[collectionId] = collection;
        }
        return collection;
    };
    BaseGame.prototype.initializeGameObjectCollections = function () {
        this._gameObjectCollections = {};
    };
    return BaseGame;
}());
/// <reference path="./../rosetic/src/BaseGame.ts" />
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.solidTiles = [3, 4, 5, 6, 19, 22, 35, 38, 51, 54];
        return _this;
    }
    Game.prototype.init = function () {
        this.setCurrentLevel(new GameTitle(this));
    };
    return Game;
}(BaseGame));
/// <reference path="./../rosetic/src/GameObject.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid | ComponentFlags.Actor) || this;
        _this.hurtTimer = 0;
        _this.hurtTimerValue = 0;
        _this.hurtJumpVector = Vector2.zero;
        _this.tags |= GameObjectTags.Player;
        return _this;
    }
    Player.prototype.onDestroy = function () {
        this.game.setCurrentLevel(new GameOver(this.game));
        if (this.game.hiScore < this.score) {
            this.game.hiScore = this.score;
        }
    };
    Player.prototype.onCollision = function (collidingObject) {
        if (this.hurtTimer == 0) {
            this.velocity.x = collidingObject.velocity.x > 0 ? this.hurtJumpVector.x : -this.hurtJumpVector.x;
            this.velocity.y = this.hurtJumpVector.y;
            this.components.actor.hitPoints -= 1;
            this.hurtTimer = this.hurtTimerValue;
        }
    };
    Player.prototype.onUpdate = function (tic) {
        this.velocity.y = this.velocity.y + this.game.gravity;
        if (this.hurtTimer > 0) {
            this.hurtTimer -= 1;
        }
        var collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
        if (collidingObject != null) {
            if (this.states[Moves.Dash.stateKey]) {
                collidingObject.onCollision(this);
                if (collidingObject.components.actor.isDead()) {
                    this.score += collidingObject.components.actor.scoreValue;
                }
            }
            else {
                this.onCollision(collidingObject);
            }
        }
        if (this.velocity.x <= this.defaultVelocity.x && this.velocity.x >= -this.defaultVelocity.x) {
            if (this.game.api.btn(Button.Left)) {
                this.velocity.x = -this.defaultVelocity.x;
            }
            else if (this.game.api.btn(Button.Right)) {
                this.velocity.x = this.defaultVelocity.x;
            }
            else {
                this.velocity.x = 0;
            }
        }
        if (this.components.solid.grounded && this.game.api.btnp(Button.A)) {
            this.velocity.y = -2.7;
        }
        if (this.velocity.x > this.defaultVelocity.x) {
            this.velocity.x -= 0.2;
        }
        else if (this.velocity.x < -this.defaultVelocity.x) {
            this.velocity.x += 0.2;
        }
        this.components.visible.color = 13;
        if (this.hurtTimer > 0) {
            this.components.visible.color = 15;
            if (tic % 4 == 1) {
                this.components.visible.hide = !this.components.visible.hide;
            }
        }
        else if (this.states[Moves.Dash.stateKey]) {
            this.components.visible.color = 14;
            if (tic % 4 == 1) {
                this.components.visible.hide = !this.components.visible.hide;
            }
        }
        else {
            this.components.visible.hide = false;
        }
    };
    Player.create = function (parent) {
        var player = new Player(parent, "player" + Tools.unique());
        player.position = new Vector2(115, 70);
        player.components.visible.color = 15;
        player.dimensions = new Vector2(6, 8);
        player.defaultVelocity = new Vector2(1, 0);
        player.components.actor.hitPoints = 5;
        player.hurtTimerValue = 30;
        player.hurtJumpVector = new Vector2(2, -2);
        Moves.Dash.create(player);
        return player;
    };
    return Player;
}(GameObject));
var Tic80Api = /** @class */ (function () {
    function Tic80Api() {
    }
    Tic80Api.prototype.map = function (x, y, w, h, sx, sy, colorkey, scale, remap) {
        map(x, y, w, h, sx, sy, colorkey, scale, remap);
    };
    Tic80Api.prototype.rect = function (x, y, w, h, color) {
        rect(x, y, w, h, color);
    };
    Tic80Api.prototype.cls = function (color) {
        cls(color);
    };
    Tic80Api.prototype.btnp = function (id, hold, period) {
        return btnp(id, hold, period);
    };
    Tic80Api.prototype.btn = function (id) {
        return btn(id);
    };
    Tic80Api.prototype.reset = function () {
        reset();
    };
    Tic80Api.prototype.print = function (str, x, y, color, fixed, scale) {
        return print(str, x, y, color, fixed, scale);
    };
    Tic80Api.prototype.mget = function (x, y) {
        return mget(x, y);
    };
    Tic80Api.prototype.time = function () {
        return time();
    };
    Tic80Api.prototype.key = function (code) {
        return key(code);
    };
    Tic80Api.prototype.trace = function (msg, color) {
        trace(msg, color);
    };
    return Tic80Api;
}());
/// <reference path="./../rosetic/src/GameObject.ts" />
var WaterParticle = /** @class */ (function (_super) {
    __extends(WaterParticle, _super);
    function WaterParticle(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid) || this;
        _this.liveCounter = 20;
        _this.dimensions = new Vector2(2, 2);
        _this.components.visible.color = 9;
        return _this;
    }
    WaterParticle.prototype.onUpdate = function (tic) {
        this.velocity.y = this.velocity.y + this.game.gravity;
        if (this.components.solid.grounded) {
            this.velocity.x = 0;
            this.liveCounter--;
        }
        if (this.liveCounter <= 0) {
            this.destroy();
        }
    };
    WaterParticle.create = function (parent, startVelocity) {
        var waterParticle = new WaterParticle(parent, "WaterParticle" + Tools.unique());
        waterParticle.velocity = startVelocity.copy();
        return waterParticle;
    };
    return WaterParticle;
}(GameObject));
/// <reference path="./../../rosetic/src/GameObject.ts" />
var Enemies;
(function (Enemies) {
    var Spid = /** @class */ (function (_super) {
        __extends(Spid, _super);
        function Spid(parent, id, target) {
            var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid | ComponentFlags.Actor) || this;
            _this.jumpSpeed = -2;
            _this.blockedFromAbove = false;
            _this.blockedFromBottom = false;
            _this.canJumpOnOtherSpid = false;
            _this.hasSpidAbove = false;
            _this.blockedHorizontally = false;
            _this.freezeCounter = 0;
            _this.defaultFreezeCounter = 0;
            _this.killerVelocity = null;
            _this.target = target;
            _this.tags |= GameObjectTags.Enemy;
            return _this;
        }
        Object.defineProperty(Spid.prototype, "_spids", {
            get: function () {
                return this.game.getGameObjectCollection(Spid.spidsCollectionId);
            },
            enumerable: true,
            configurable: true
        });
        Spid.prototype.onUpdate = function (tic) {
            if (this.freezeCounter > 0) {
                this.freezeCounter--;
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.components.visible.color = 15;
                return;
            }
            this.components.visible.color = this.components.visible.defaultColor;
            var stoppedAtFrameStart = (this.velocity.x == 0 && this.velocity.y == 0);
            this.velocity.y = this.velocity.y + this.game.gravity;
            if (this.velocity.x > this.defaultVelocity.x) {
                this.velocity.x -= 0.2;
            }
            else if (this.velocity.x < -this.defaultVelocity.x) {
                this.velocity.x += 0.2;
            }
            if (Math.abs(this.velocity.x) <= this.defaultVelocity.x) {
                if (this.position.x >= this.target.position.x + this.target.dimensions.x) {
                    this.velocity.x = -this.defaultVelocity.x;
                }
                else if (this.position.x + this.dimensions.x - 1 <= this.target.position.x) {
                    this.velocity.x = this.defaultVelocity.x;
                }
            }
            if ((stoppedAtFrameStart && this.components.solid.grounded && !this.hasSpidAbove)
                || (stoppedAtFrameStart && this.canJumpOnOtherSpid && !this.hasSpidAbove)) {
                this.velocity.y = this.jumpSpeed;
            }
            this.blockedFromAbove = false;
            this.blockedFromBottom = false;
            this.canJumpOnOtherSpid = false;
            this.hasSpidAbove = false;
            this.blockedHorizontally = false;
            var blocked = false;
            for (var i = 0; i < this._spids.length; i++) {
                var otherSpid = this._spids[i];
                if (this != otherSpid) {
                    var overlapsXAxis = BoundingBoxCollider.overlapsXAxis(this.position, this.velocity, this.dimensions, otherSpid.position, otherSpid.dimensions);
                    var overlapsYAxis = BoundingBoxCollider.overlapsYAxis(this.position, this.velocity, this.dimensions, otherSpid.position, otherSpid.dimensions);
                    if (this.position.y > otherSpid.position.y && overlapsXAxis) {
                        this.hasSpidAbove = true;
                    }
                    if (overlapsXAxis && overlapsYAxis) {
                        if (this.position.y > otherSpid.position.y) {
                            this.blockedFromAbove = true;
                        }
                        if (this.position.y < otherSpid.position.y) {
                            this.blockedFromBottom = true;
                            if (otherSpid.velocity.y == 0) {
                                this.canJumpOnOtherSpid = true;
                            }
                        }
                        blocked = true;
                    }
                }
            }
            if (blocked) {
                this.velocity.x = 0;
            }
            if ((this.blockedFromAbove && this.velocity.y < 0)
                || (this.blockedFromBottom && this.velocity.y > 0)) {
                this.velocity.y = 0;
            }
        };
        Spid.prototype.onCollision = function (collidingObject) {
            this.components.actor.hitPoints -= 1;
            this.freezeCounter = this.defaultFreezeCounter;
            if (this.components.actor.isDead()) {
                this.killerVelocity = collidingObject.velocity.copy();
                this.killerPosition = collidingObject.position.copy();
            }
        };
        Spid.prototype.onDestroy = function () {
            this.spawnParticlesOfDeath();
            for (var i = 0; i < this._spids.length; i++) {
                var selectedSpid = this._spids[i];
                if (this == selectedSpid) {
                    this._spids.splice(i, 1);
                }
            }
        };
        Spid.prototype.spawnParticlesOfDeath = function () {
            for (var i = 0; i < 3; i++) {
                var bloodParticle = new BloodParticle(this.game.root, "bloodParticle" + Tools.unique());
                bloodParticle.position = this.position.copy();
                var xVelocity = void 0;
                if (this.killerVelocity.x != 0) {
                    xVelocity = this.killerVelocity.x;
                }
                else {
                    if (this.killerPosition > this.position) {
                        xVelocity = 0.5 + (1 * (i * 0.5));
                    }
                    else {
                        xVelocity = -0.5 + (-1 * (i * 0.5));
                    }
                }
                var yVelocity = -i - 1;
                bloodParticle.velocity = new Vector2(xVelocity, yVelocity);
            }
        };
        Spid.create = function (parent, startVelocity) {
            var spid = new Enemies.Spid(parent, "spid" + Tools.unique(), parent.game.player);
            spid.dimensions = new Vector2(4, 4);
            spid.defaultVelocity = new Vector2(0.4, 0);
            spid.velocity = startVelocity;
            spid.components.actor.hitPoints = 2;
            spid.defaultFreezeCounter = 10;
            spid.jumpSpeed = -1.7;
            spid.components.visible.defaultColor = Tools.getRandomInt(10, 12);
            spid.components.visible.color = spid.components.visible.defaultColor;
            parent.game.getGameObjectCollection(Spid.spidsCollectionId).push(spid);
            return spid;
        };
        Spid.spidsCollectionId = "spids";
        return Spid;
    }(GameObject));
    Enemies.Spid = Spid;
})(Enemies || (Enemies = {}));
var Level = /** @class */ (function () {
    function Level(game) {
        this.game = game;
    }
    Level.prototype.init = function () { };
    Level.prototype.update = function (tic) { };
    return Level;
}());
/// <reference path="./../../rosetic/src/Level.ts" />
var GameOver = /** @class */ (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameOver.prototype.update = function (tic) {
        Tools.printCentered(this.game.api, "GAME OVER", undefined, undefined, 13);
        Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13);
        if (this.game.api.btnp(Button.X)) {
            this.game.setCurrentLevel(new GameStart(this.game));
        }
    };
    return GameOver;
}(Level));
/// <reference path="./../../rosetic/src/Level.ts" />
var GamePlay = /** @class */ (function (_super) {
    __extends(GamePlay, _super);
    function GamePlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePlay.prototype.update = function (tic) {
        this.game.root.update(tic);
        this.game.api.cls();
        this.renderMap();
        this.game.root.draw();
        this.renderUI();
    };
    GamePlay.prototype.renderMap = function () {
        this.game.api.map(this.game.mapOffset.x, this.game.mapOffset.y);
    };
    GamePlay.prototype.renderUI = function () {
        for (var i = 0; i < this.game.player.components.actor.hitPoints; i++) {
            this.game.api.print("*", i * 8, 0, 13);
        }
        Tools.printRight(this.game.api, "SCORE: " + this.game.player.score.toString(), 240, 0, 13);
        Tools.printCentered(this.game.api, "HI-SCORE: " + this.game.hiScore.toString(), undefined, 0, 13);
    };
    return GamePlay;
}(Level));
/// <reference path="./../../rosetic/src/Level.ts" />
var GameStart = /** @class */ (function (_super) {
    __extends(GameStart, _super);
    function GameStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameStart.prototype.update = function (tic) {
        this.game.api.cls();
        Tools.printCentered(this.game.api, "WARG", undefined, 40, 10, false, 3);
        Tools.printCentered(this.game.api, "A button/Z key : Jump", undefined, 110, 13);
        Tools.printCentered(this.game.api, "B button/X key : Dash", undefined, 130, 13);
        Tools.printCentered(this.game.api, "X button/A key : Weapon", undefined, 150, 13);
        Tools.printCentered(this.game.api, "D Pad/Arrows : Movement", undefined, 170, 13);
        Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13);
        if (this.game.api.btnp(Button.X)) {
            this.game.setCurrentLevel(new Sewers(this.game));
        }
    };
    return GameStart;
}(Level));
var Tools;
(function (Tools) {
    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    Tools.getRandomFloat = getRandomFloat;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    Tools.getRandomInt = getRandomInt;
    function getRandom() {
        return Math.random();
    }
    Tools.getRandom = getRandom;
    function normalize(value) {
        if (value > 0) {
            return 1;
        }
        else if (value < 0) {
            return -1;
        }
        else {
            return 0;
        }
    }
    Tools.normalize = normalize;
    function printRight(api, str, x, y, color, fixed, scale) {
        var width = api.print(str, 0, -6);
        return api.print(str, (x - width), y, color, fixed, scale);
    }
    Tools.printRight = printRight;
    function printCentered(api, str, x, y, color, fixed, scale) {
        var width = api.print(str, 0, -100, color, fixed, scale);
        x = x == undefined ? 240 : x;
        y = y == undefined ? 136 : y;
        return api.print(str, (x - width) / 2, (y) / 2, color, fixed, scale);
    }
    Tools.printCentered = printCentered;
    function unique() {
        return Math.random().toString(36);
    }
    Tools.unique = unique;
})(Tools || (Tools = {}));
var Button;
(function (Button) {
    Button[Button["Up"] = 0] = "Up";
    Button[Button["Down"] = 1] = "Down";
    Button[Button["Left"] = 2] = "Left";
    Button[Button["Right"] = 3] = "Right";
    Button[Button["A"] = 4] = "A";
    Button[Button["B"] = 5] = "B";
    Button[Button["X"] = 6] = "X";
    Button[Button["Y"] = 7] = "Y"; //S
})(Button || (Button = {}));
/// <reference path="./../../rosetic/src/Level.ts" />
/// <reference path="./../../rosetic/src/Tools.ts" />
/// <reference path="./../../rosetic/src/Button.ts" />
var GameTitle = /** @class */ (function (_super) {
    __extends(GameTitle, _super);
    function GameTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameTitle.prototype.update = function (tic) {
        this.game.api.cls();
        this.game.api.print("WARG", 5, 10, 10, false, 10);
        Tools.printCentered(this.game.api, "by Cheap Sunglasses Crew", undefined, 150, 13, false, 1.5);
        Tools.printCentered(this.game.api, "Press X button/A key", undefined, 230, 13);
        if (this.game.api.btnp(Button.X)) {
            this.game.setCurrentLevel(new GameStart(this.game));
        }
    };
    return GameTitle;
}(Level));
var Sewers = /** @class */ (function (_super) {
    __extends(Sewers, _super);
    function Sewers() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.phase = 0;
        _this.phaseDurationCounter = 0;
        _this.delayCounter = 0;
        _this.delayedPhase = 0;
        return _this;
    }
    Sewers.prototype.init = function () {
        _super.prototype.init.call(this);
        this.game.initializeGameObjectCollections();
        this.game.root.reset();
        this.game.player = Player.create(this.game.root);
        this.game.player.position = new Vector2(115, 70);
        Sword.create(this.game.player);
        var waterMinRandomStart = new Vector2(0.5, 0);
        var waterMaxRandomStart = new Vector2(1.7, 0);
        var waterSpawnProbability = 0.4;
        var spidCount = 10;
        this.leftSpawnSpid = new SpawnBox(this.game.root, "LeftSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
        this.leftSpawnSpid.position = new Vector2(12, 80);
        this.leftSpawnSpid.dimensions = new Vector2(1, 2);
        this.leftSpawnSpid.minRandomStartVelocity = new Vector2(1.8, 0);
        this.leftSpawnSpid.maxRandomStartVelocity = new Vector2(2.5, 0);
        this.leftSpawnSpid.count = this.leftSpawnSpid.maxCount;
        this.leftSpawnWater = new SpawnBox(this.game.root, "leftSpawnWater", WaterParticle.create, 50, 2, waterSpawnProbability);
        this.leftSpawnWater.position = new Vector2(12, 80);
        this.leftSpawnWater.dimensions = new Vector2(1, 2);
        this.leftSpawnWater.minRandomStartVelocity = waterMinRandomStart;
        this.leftSpawnWater.maxRandomStartVelocity = waterMaxRandomStart;
        this.leftSpawnWater.count = this.leftSpawnWater.maxCount;
        this.rightSpawnSpid = new SpawnBox(this.game.root, "RightSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
        this.rightSpawnSpid.position = new Vector2(227, 80);
        this.rightSpawnSpid.dimensions = new Vector2(1, 2);
        this.rightSpawnSpid.minRandomStartVelocity = new Vector2(-1.8, 0);
        this.rightSpawnSpid.maxRandomStartVelocity = new Vector2(-2.5, 0);
        this.rightSpawnSpid.count = this.rightSpawnSpid.maxCount;
        this.rightSpawnWater = new SpawnBox(this.game.root, "rightSpawnWater", WaterParticle.create, 50, 2, waterSpawnProbability);
        this.rightSpawnWater.position = new Vector2(227, 80);
        this.rightSpawnWater.dimensions = new Vector2(1, 2);
        this.rightSpawnWater.minRandomStartVelocity = new Vector2(-waterMinRandomStart.x, waterMinRandomStart.y);
        this.rightSpawnWater.maxRandomStartVelocity = new Vector2(-waterMaxRandomStart.x, waterMaxRandomStart.y);
        this.rightSpawnWater.count = this.rightSpawnWater.maxCount;
        this.topSpawnSpid = new SpawnBox(this.game.root, "TopSpawnSpid", Enemies.Spid.create, spidCount, 7, 0.6);
        this.topSpawnSpid.position = new Vector2(110, 46);
        this.topSpawnSpid.dimensions = new Vector2(20, 2);
        this.topSpawnSpid.startVelocity = new Vector2(0, 0);
        this.topSpawnSpid.count = this.topSpawnSpid.maxCount;
        this.topSpawnWater = new SpawnBox(this.game.root, "topSpawnWater", WaterParticle.create, 220, 0, 1);
        this.topSpawnWater.position = new Vector2(110, 48);
        this.topSpawnWater.dimensions = new Vector2(20, 2);
        this.topSpawnWater.startVelocity = new Vector2(0, 0);
        this.topSpawnWater.count = this.topSpawnWater.maxCount;
        this.game.mapOffset = new Vector2(0, 0);
        this.game.gravity = 0.2;
        this.phase = 0;
        this.delayCounter = 60;
        this.delayedPhase = 1;
    };
    Sewers.prototype.update = function (tic) {
        this.phaseDurationCounter++;
        if (this.phase == 0) {
            if (this.phaseDurationCounter == this.delayCounter) {
                this.setPhase(this.delayedPhase);
            }
        }
        else if (this.phase == 1) {
            var randomPhase = Tools.getRandomInt(2, 4);
            this.setPhase(randomPhase);
        }
        else if (this.phase == 2) {
            this.leftSpawnWater.count = 0;
            this.setPhase(5, 220);
        }
        else if (this.phase == 3) {
            this.rightSpawnWater.count = 0;
            this.setPhase(6, 220);
        }
        else if (this.phase == 4) {
            this.topSpawnWater.count = 0;
            this.setPhase(7, 220);
        }
        else if (this.phase == 5) {
            this.leftSpawnSpid.count = 0;
            this.setPhase(1, 220);
        }
        else if (this.phase == 6) {
            this.rightSpawnSpid.count = 0;
            this.setPhase(1, 220);
        }
        else if (this.phase == 7) {
            this.topSpawnSpid.count = 0;
            this.setPhase(1, 220);
        }
        _super.prototype.update.call(this, tic);
    };
    Sewers.prototype.setPhase = function (phase, delayCounter) {
        if (delayCounter === void 0) { delayCounter = 0; }
        if (delayCounter == 0) {
            this.phase = phase;
        }
        else {
            this.phase = 0;
            this.delayCounter = delayCounter;
            this.delayedPhase = phase;
        }
        this.phaseDurationCounter = 0;
    };
    return Sewers;
}(GamePlay));
var Moves;
(function (Moves) {
    var Dash = /** @class */ (function (_super) {
        __extends(Dash, _super);
        function Dash(parent, id) {
            var _this = _super.call(this, parent, id, ComponentFlags.None) || this;
            _this.tags |= GameObjectTags.Move;
            return _this;
        }
        Dash.create = function (parent) {
            var dash = new Dash(parent, "dash" + Tools.unique());
            return dash;
        };
        Dash.prototype.onUpdate = function (tic) {
            if (this.game.api.btnp(Button.B)) {
                if (Math.abs(this.parent.velocity.x) <= this.parent.defaultVelocity.x) {
                    this.parent.velocity.x = 4 * this.parent.direction.x;
                    this.parent.states[Dash.stateKey] = true;
                }
            }
            if (this.parent.states[Dash.stateKey] && this.parent.velocity.x <= this.parent.defaultVelocity.x && this.parent.velocity.x >= -this.parent.defaultVelocity.x) {
                this.parent.states[Dash.stateKey] = false;
            }
        };
        Dash.stateKey = "dash";
        return Dash;
    }(GameObject));
    Moves.Dash = Dash;
})(Moves || (Moves = {}));
/// <reference path="./../../rosetic/src/GameObject.ts" />
var Sword = /** @class */ (function (_super) {
    __extends(Sword, _super);
    function Sword(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Actor) || this;
        _this.attackPhase = 0;
        _this.defaultPosition = Vector2.zero;
        _this.hitByThisSwing = [];
        _this.tags |= GameObjectTags.Weapon;
        return _this;
    }
    Sword.prototype.onUpdate = function (tic) {
        var directionOffset = 0;
        if (this.parent.direction.x < 0) {
            directionOffset = this.parent.dimensions.x - this.dimensions.x;
        }
        if (this.attackPhase == 0) {
            this.position.x = this.defaultPosition.x + directionOffset;
            if (this.game.api.btnp(Button.X)) {
                this.attackPhase += 1;
            }
        }
        if (this.attackPhase == 1) {
            if (Math.abs(this.position.x) < 9) {
                this.position.x += 3 * this.parent.direction.x;
            }
            else {
                this.attackPhase += 1;
            }
        }
        else if (this.attackPhase == 2) {
            this.position.x += -2 * this.parent.direction.x;
            if ((this.parent.direction.x > 0 && this.position.x < this.defaultPosition.x)
                || (this.parent.direction.x < 0 && this.position.x > this.defaultPosition.x + directionOffset)) {
                this.position.x = this.defaultPosition.x + directionOffset;
                this.attackPhase = 0;
                this.hitByThisSwing = [];
            }
        }
        if (this.attackPhase != 0) {
            var collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
            if (collidingObject != null) {
                if (this.hitByThisSwing.indexOf(collidingObject) < 0) {
                    this.hitByThisSwing.push(collidingObject);
                    collidingObject.onCollision(this);
                    if (collidingObject.components.actor.isDead()) {
                        this.parent.score += collidingObject.components.actor.scoreValue;
                    }
                }
            }
        }
    };
    Sword.create = function (parent) {
        var sword = new Sword(parent, "sword" + Tools.unique());
        sword.dimensions = new Vector2(8, 2);
        sword.defaultPosition = new Vector2(0, 3);
        sword.position = sword.defaultPosition.copy();
        sword.components.visible.color = 4;
        return sword;
    };
    return Sword;
}(GameObject));
/// <reference path="../rosetic/src/IApi.ts" />
var DebugApi = /** @class */ (function () {
    function DebugApi() {
    }
    DebugApi.prototype.map = function (x, y, w, h, sx, sy, colorkey, scale, remap) {
    };
    DebugApi.prototype.rect = function (x, y, w, h, color) {
        //console.log(`rect(x: ${x}, y: ${y}, w: ${w}, h: ${h}, color: ${color})`);
    };
    DebugApi.prototype.cls = function (color) {
    };
    DebugApi.prototype.btnp = function (id, hold, period) {
        return false;
    };
    DebugApi.prototype.btn = function (id) {
        return false;
    };
    DebugApi.prototype.reset = function () {
    };
    DebugApi.prototype.print = function (str, x, y, color, fixed, scale) {
        return 0;
    };
    DebugApi.prototype.mget = function (x, y) {
        return 0;
    };
    DebugApi.prototype.time = function () {
        return new Date().getTime();
    };
    DebugApi.prototype.key = function (code) {
        return false;
    };
    DebugApi.prototype.trace = function (msg, color) {
        console.log(msg);
    };
    return DebugApi;
}());
/// <reference path="./../Game/Game.ts" />
/// <reference path="./DebugApi.ts" />
var ticDebug = 0;
var game;
function debug() {
    if (ticDebug == 0) {
        game = new Game(new DebugApi());
        game.init();
    }
    game.update(ticDebug);
    ticDebug++;
}
do {
    debug();
} while (true);
var BoundingBoxCollider = /** @class */ (function () {
    function BoundingBoxCollider() {
    }
    BoundingBoxCollider.overlaps = function (position1, velocity1, dimensions1, position2, dimensions2) {
        return (position1.x + velocity1.x < position2.x + dimensions2.x
            && position1.x + dimensions1.x + velocity1.x > position2.x
            && position1.y + velocity1.y < position2.y + dimensions2.y
            && position1.y + dimensions1.y + velocity1.y > position2.y);
    };
    BoundingBoxCollider.overlapsXAxis = function (position1, velocity1, dimensions1, position2, dimensions2) {
        return (position1.x + velocity1.x < position2.x + dimensions2.x
            && position1.x + dimensions1.x + velocity1.x > position2.x);
    };
    BoundingBoxCollider.overlapsYAxis = function (position1, velocity1, dimensions1, position2, dimensions2) {
        return (position1.y + velocity1.y < position2.y + dimensions2.y
            && position1.y + dimensions1.y + velocity1.y > position2.y);
    };
    return BoundingBoxCollider;
}());
var GameObjectTags;
(function (GameObjectTags) {
    GameObjectTags[GameObjectTags["None"] = 0] = "None";
    GameObjectTags[GameObjectTags["Player"] = 1] = "Player";
    GameObjectTags[GameObjectTags["Enemy"] = 2] = "Enemy";
    GameObjectTags[GameObjectTags["Weapon"] = 4] = "Weapon";
    GameObjectTags[GameObjectTags["Move"] = 8] = "Move";
})(GameObjectTags || (GameObjectTags = {}));
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor(game) {
        this.ticTime = 16.6666666667;
        this.game = game;
        this.lastTime = this.game.api.time();
    }
    PerformanceMonitor.prototype.draw = function () {
        var frameTime = this.frameEndTime - this.frameStartTime;
        var performance = Math.floor((frameTime / this.ticTime * 100) / 2);
        this.game.api.rect(235, 10, 5, 50 - performance, 15);
        this.game.api.rect(235, 60 - performance, 5, performance, 6);
    };
    return PerformanceMonitor;
}());
/// <reference path="./GameObject.ts" />
var SpawnBox = /** @class */ (function (_super) {
    __extends(SpawnBox, _super);
    function SpawnBox(parent, id, spawnFunction, maxCount, deaultLockCounter, probability) {
        var _this = _super.call(this, parent, id, ComponentFlags.None) || this;
        _this.lockCounter = 0;
        _this.count = 0;
        _this.startVelocity = Vector2.zero;
        _this.maxRandomStartVelocity = null;
        _this.minRandomStartVelocity = null;
        _this.spawnFunction = spawnFunction;
        _this.maxCount = maxCount;
        _this.defaultLockCounter = deaultLockCounter;
        _this.probability = probability;
        _this.dimensions = new Vector2(1, 1);
        return _this;
    }
    SpawnBox.prototype.onUpdate = function (tic) {
        this.spawn();
    };
    SpawnBox.prototype.spawn = function () {
        if (this.count >= this.maxCount) {
            return;
        }
        if (this.lockCounter > 0) {
            this.lockCounter--;
            return;
        }
        if (Math.random() < this.probability) {
            var startVelocity = this.startVelocity.copy();
            if (this.maxRandomStartVelocity != null && this.minRandomStartVelocity != null) {
                startVelocity = new Vector2(Tools.getRandomFloat(this.minRandomStartVelocity.x, this.maxRandomStartVelocity.x), Tools.getRandomFloat(this.minRandomStartVelocity.y, this.maxRandomStartVelocity.y));
            }
            var spawn = this.spawnFunction(this.parent, startVelocity);
            var position = this.position.copy();
            if (this.dimensions.x > 1) {
                position.x = Tools.getRandomFloat(this.position.x, this.position.x + this.dimensions.x);
            }
            if (this.dimensions.y > 1) {
                position.y = Tools.getRandomFloat(this.position.y, this.position.y + this.dimensions.y);
            }
            spawn.position = position;
            this.lockCounter = this.defaultLockCounter;
            this.count++;
        }
    };
    return SpawnBox;
}(GameObject));
/// <reference path="./../Component.ts" />
var Components;
(function (Components) {
    var Actor = /** @class */ (function (_super) {
        __extends(Actor, _super);
        function Actor() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.hitPoints = null;
            _this.scoreValue = 5;
            return _this;
        }
        Actor.prototype.update = function (tic) {
            if (this.isDead()) {
                this.gameObject.destroy();
            }
        };
        Actor.prototype.isDead = function () {
            if (this.hitPoints == null) {
                return false;
            }
            if (this.hitPoints <= 0) {
                return true;
            }
            return false;
        };
        Actor.prototype.getFirstObjectCollision = function (tags) {
            if (tags === void 0) { tags = GameObjectTags.None; }
            for (var _i = 0, _a = this.gameObject.game.root.childrenByComponent(ComponentFlags.Actor); _i < _a.length; _i++) {
                var actor = _a[_i];
                if (actor.hasTags(tags)
                    && actor != this.gameObject
                    && actor != this.gameObject.parent) {
                    if (BoundingBoxCollider.overlaps(this.gameObject.getGlobalPosition(), Vector2.zero, this.gameObject.dimensions, actor.position, actor.dimensions)) {
                        return actor;
                    }
                }
            }
            return null;
        };
        return Actor;
    }(Component));
    Components.Actor = Actor;
})(Components || (Components = {}));
/// <reference path="./../Component.ts" />
var Components;
(function (Components) {
    var Solid = /** @class */ (function (_super) {
        __extends(Solid, _super);
        function Solid(gameObject) {
            var _this = _super.call(this, gameObject) || this;
            _this.grounded = false;
            return _this;
        }
        Solid.prototype.update = function (tic) {
        };
        Solid.prototype.collideWithSolid = function (position, velocity, dimensions) {
            if (position === void 0) { position = this.gameObject.position; }
            if (velocity === void 0) { velocity = this.gameObject.velocity; }
            if (dimensions === void 0) { dimensions = this.gameObject.dimensions; }
            if (velocity.x < 0 && this.leftCollision(position, velocity, dimensions)) {
                while (velocity.x < -1 && this.leftCollision(position, velocity, dimensions)) {
                    velocity.x += 1;
                }
                var flooredY = Math.floor(position.x + velocity.x);
                var totalY = position.x + velocity.x;
                if (this.leftCollision(position, velocity, dimensions)) {
                    var remainderY = (flooredY + 1) - totalY;
                    velocity.x += remainderY;
                }
                else {
                    var remainderY = totalY - flooredY;
                    velocity.x -= remainderY;
                }
                position.x += velocity.x;
                velocity.x = 0;
            }
            else if (velocity.x > 0 && this.rightCollision(position, velocity, dimensions)) {
                while (velocity.x >= 1 && this.rightCollision(position, velocity, dimensions)) {
                    velocity.x -= 1;
                }
                var flooredY = Math.floor(position.x + velocity.x);
                var totalY = position.x + velocity.x;
                if (this.rightCollision(position, velocity, dimensions)) {
                    var remainderY = totalY - flooredY;
                    velocity.x -= remainderY;
                }
                else {
                    var remainderY = (flooredY + 1) - totalY;
                    velocity.x += remainderY;
                }
                position.x += velocity.x;
                velocity.x = 0;
            }
            this.grounded = false;
            if (velocity.y > 0 && this.bottomCollision(position, velocity, dimensions)) {
                while (velocity.y >= 1 && this.bottomCollision(position, velocity, dimensions)) {
                    velocity.y -= 1;
                }
                var flooredY = Math.floor(position.y + velocity.y);
                var totalY = position.y + velocity.y;
                if (this.bottomCollision(position, velocity, dimensions)) {
                    var remainderY = totalY - flooredY;
                    velocity.y -= remainderY;
                }
                else {
                    var remainderY = (flooredY + 1) - totalY;
                    velocity.y += remainderY;
                }
                position.y += velocity.y;
                velocity.y = 0;
                this.grounded = true;
            }
            else if (velocity.y < 0 && this.topCollision(position, velocity, dimensions)) {
                while (velocity.y < -1 && this.topCollision(position, velocity, dimensions)) {
                    velocity.y += 1;
                }
                var flooredY = Math.floor(position.y + velocity.y);
                var totalY = position.y + velocity.y;
                if (this.topCollision(position, velocity, dimensions)) {
                    var remainderY = (flooredY + 1) - totalY;
                    velocity.y += remainderY;
                }
                else {
                    var remainderY = totalY - flooredY;
                    velocity.y -= remainderY;
                }
                position.y += velocity.y;
                velocity.y = 0;
            }
        };
        Solid.prototype.withTile = function (x, y) {
            var spriteNumber = this.gameObject.game.api.mget(Math.floor((x / 8) + this.gameObject.game.mapOffset.x), Math.floor(((y) / 8) + this.gameObject.game.mapOffset.y));
            var collision = this.gameObject.game.solidTiles.indexOf(spriteNumber) >= 0;
            return collision;
        };
        Solid.prototype.leftCollision = function (position, velocity, dimensions) {
            if (this.withTile(position.x + velocity.x, position.y + velocity.y)
                || this.withTile(position.x + velocity.x, position.y + velocity.y + dimensions.y - 1)) {
                return true;
            }
            return false;
        };
        Solid.prototype.rightCollision = function (position, velocity, dimensions) {
            if (this.withTile(position.x + dimensions.x + velocity.x, position.y + velocity.y)
                || this.withTile(position.x + dimensions.x + velocity.x, position.y + velocity.y + dimensions.y - 1)) {
                return true;
            }
            return false;
        };
        Solid.prototype.bottomCollision = function (position, velocity, dimensions) {
            if (this.withTile(position.x + velocity.x, position.y + dimensions.y + velocity.y)
                || this.withTile(position.x + velocity.x + dimensions.x - 1, position.y + dimensions.y + velocity.y)) {
                return true;
            }
            return false;
        };
        Solid.prototype.topCollision = function (position, velocity, dimensions) {
            if (velocity.y < 0 &&
                (this.withTile(position.x + velocity.x, position.y + velocity.y)
                    || this.withTile(position.x + dimensions.x - 1 + velocity.x, position.y + velocity.y))) {
                return true;
            }
            return false;
        };
        return Solid;
    }(Component));
    Components.Solid = Solid;
})(Components || (Components = {}));
//# sourceMappingURL=compiled.js.map