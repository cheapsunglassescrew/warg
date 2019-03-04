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
var BaseGame = /** @class */ (function () {
    function BaseGame(engine) {
        this.hiScore = 0;
        this.gravity = 0;
        this.tic = 0;
        this.engine = engine;
        this.root = new RootGameObject(this, "_root", ComponentFlags.Visible);
        this.performanceMonitor = new PerformanceMonitor(this);
    }
    BaseGame.prototype.update = function (tic) {
        this.tic = tic;
        this.performanceMonitor.frameStartTime = this.engine.time();
        this.gameStates[this.gameState].update(tic);
        this.performanceMonitor.frameEndTime = this.engine.time();
        this.performanceMonitor.draw();
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
var BoundingBoxCollider = /** @class */ (function () {
    function BoundingBoxCollider() {
    }
    BoundingBoxCollider.overlaps = function (position1, velocity1, dimensions1, position2, dimensions2) {
        return (position1.x + velocity1.x < position2.x + dimensions2.x
            && position1.x + dimensions1.x + velocity1.x > position2.x
            && position1.y + +velocity1.y < position2.y + dimensions2.y
            && position1.y + dimensions1.y + velocity1.y > position2.y);
    };
    return BoundingBoxCollider;
}());
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
var Component = /** @class */ (function () {
    function Component(gameObject) {
        this.gameObject = gameObject;
    }
    Component.prototype.update = function (tic) {
    };
    return Component;
}());
var ComponentFlags;
(function (ComponentFlags) {
    ComponentFlags[ComponentFlags["None"] = 0] = "None";
    ComponentFlags[ComponentFlags["Visible"] = 1] = "Visible";
    ComponentFlags[ComponentFlags["Solid"] = 2] = "Solid";
    ComponentFlags[ComponentFlags["Actor"] = 4] = "Actor";
})(ComponentFlags || (ComponentFlags = {}));
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
var RootGameObject = /** @class */ (function () {
    function RootGameObject(game, id, componentFlags) {
        this.children = [];
        this.states = {};
        this.position = Vector2.zero;
        this.dimensions = Vector2.zero;
        this.velocity = Vector2.zero;
        this.defaultVelocity = Vector2.zero;
        this.score = 0;
        this.tags = 0;
        this.game = game;
        this.id = id;
        this.components = new ComponentManager(this, componentFlags);
    }
    RootGameObject.prototype.onHit = function (hitter) {
        throw new Error("Method not implemented.");
    };
    RootGameObject.prototype.getGlobalPosition = function () {
        return this.position;
    };
    RootGameObject.prototype.removeChild = function (child) {
        for (var i = 0; i < this.children.length; i++) {
            var element = this.children[i];
            if (element == child) {
                this.children.splice(i, 1);
            }
        }
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
    GameObject.prototype.onHit = function (hitter) { };
    GameObject.prototype.onDestroy = function () { };
    GameObject.prototype.update = function (tic) {
        this.components.update(tic);
        this.onUpdate(tic);
        if (this.components.hasComponent(ComponentFlags.Solid)) {
            this.components.solid.collide();
        }
        _super.prototype.update.call(this, tic);
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
var GameObjectTags;
(function (GameObjectTags) {
    GameObjectTags[GameObjectTags["None"] = 0] = "None";
    GameObjectTags[GameObjectTags["Player"] = 1] = "Player";
    GameObjectTags[GameObjectTags["Enemy"] = 2] = "Enemy";
    GameObjectTags[GameObjectTags["Weapon"] = 4] = "Weapon";
    GameObjectTags[GameObjectTags["Move"] = 8] = "Move";
})(GameObjectTags || (GameObjectTags = {}));
var GameState = /** @class */ (function () {
    function GameState(game) {
        this.game = game;
    }
    GameState.prototype.update = function (tic) { };
    return GameState;
}());
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor(game) {
        this.ticTime = 16.6666666667;
        this.game = game;
        this.lastTime = this.game.engine.time();
    }
    PerformanceMonitor.prototype.draw = function () {
        var frameTime = this.frameEndTime - this.frameStartTime;
        var performance = Math.floor((frameTime / this.ticTime * 100) / 2);
        this.game.engine.rect(235, 10, 5, 50 - performance, 15);
        this.game.engine.rect(235, 60 - performance, 5, performance, 6);
    };
    return PerformanceMonitor;
}());
// class SolidCollider {
//   collide(position = this.gameObject.position, velocity = this.gameObject.velocity, dimensions = this.gameObject.dimensions): void {
//     if (this.leftCollision(position, velocity, dimensions)) {
//       while (velocity.x < -1 && this.leftCollision(position, velocity, dimensions)) {
//         velocity.x += 1;
//       }
//       var flooredY = Math.floor(position.x + velocity.x);
//       var totalY = position.x + velocity.x;
//       if (this.leftCollision(position, velocity, dimensions)) {
//         var remainderY = (flooredY + 1) - totalY;
//         velocity.x += remainderY;
//       } else {
//         var remainderY = totalY - flooredY;
//         velocity.x -= remainderY;
//       }
//       position.x += velocity.x;
//       velocity.x = 0;
//     } else if (this.rightCollision(position, velocity, dimensions)) {
//       while (velocity.x >= 1 && this.rightCollision(position, velocity, dimensions)) {
//         velocity.x -= 1;
//       }
//       var flooredY = Math.floor(position.x + velocity.x);
//       var totalY = position.x + velocity.x;
//       if (this.rightCollision(position, velocity, dimensions)) {
//         var remainderY = totalY - flooredY;
//         velocity.x -= remainderY;
//       } else {
//         var remainderY = (flooredY + 1) - totalY;
//         velocity.x += remainderY;
//       }
//       position.x += velocity.x;
//       velocity.x = 0;
//     }
//     this.grounded = false;
//     if (this.bottomCollision(position, velocity, dimensions)) {
//       while (velocity.y >= 1 && this.bottomCollision(position, velocity, dimensions)) {
//         velocity.y -= 1;
//       }
//       var flooredY = Math.floor(position.y + velocity.y);
//       var totalY = position.y + velocity.y;
//       if (this.bottomCollision(position, velocity, dimensions)) {
//         var remainderY = totalY - flooredY;
//         velocity.y -= remainderY;
//       } else {
//         var remainderY = (flooredY + 1) - totalY;
//         velocity.y += remainderY;
//       }
//       position.y += velocity.y;
//       velocity.y = 0;
//       this.grounded = true;
//     } else if (this.topCollision(position, velocity, dimensions)) {
//       while (velocity.y < -1 && this.topCollision(position, velocity, dimensions)) {
//         velocity.y += 1;
//       }
//       var flooredY = Math.floor(position.y + velocity.y);
//       var totalY = position.y + velocity.y;
//       if (this.topCollision(position, velocity, dimensions)) {
//         var remainderY = (flooredY + 1) - totalY;
//         velocity.y += remainderY;
//       } else {
//         var remainderY = totalY - flooredY;
//         velocity.y -= remainderY;
//       }
//       position.y += velocity.y;
//       velocity.y = 0;
//     }
//   }
//   private withTile(x: number, y: number): boolean {
//     let spriteNumber = this.gameObject.game.engine.mget(Math.floor(((x) / 8) + this.gameObject.game.mapOffset.x), Math.floor(((y) / 8) + this.gameObject.game.mapOffset.y));
//     return this._solidTiles.indexOf(spriteNumber) >= 0;
//   }
//   private leftCollision(position: Vector2, velocity: Vector2, dimensions: Vector2): boolean {
//     if (this.withTile(position.x + velocity.x, position.y)
//       || this.withTile(position.x + velocity.x, position.y + dimensions.y - 1)) {
//       return true;
//     }
//     return false;
//   }
//   private rightCollision(position: Vector2, velocity: Vector2, dimensions: Vector2): boolean {
//     if (this.withTile(position.x + dimensions.x + velocity.x, position.y)
//       || this.withTile(position.x + dimensions.x + velocity.x, position.y + dimensions.y - 1)) {
//       return true;
//     }
//     return false;
//   }
//   private bottomCollision(position: Vector2, velocity: Vector2, dimensions: Vector2): boolean {
//     if (this.withTile(position.x, position.y + dimensions.y + velocity.y)
//       || this.withTile(position.x + dimensions.x - 1, position.y + dimensions.y + velocity.y)) {
//       return true;
//     }
//     return false;
//   }
//   private topCollision(position: Vector2, velocity: Vector2, dimensions: Vector2): boolean {
//     if (velocity.y < 0 &&
//       (this.withTile(position.x + velocity.x, position.y + velocity.y)
//         || this.withTile(position.x + dimensions.x - 1 + velocity.x, position.y + velocity.y))) {
//       return true;
//     }
//     return false;
//   }
// }
/// <reference path="./GameObject.ts" />
var SpawnBox = /** @class */ (function (_super) {
    __extends(SpawnBox, _super);
    function SpawnBox(parent, id, spawnFunction, maxCount, lockCounter, probability) {
        var _this = _super.call(this, parent, id, ComponentFlags.None) || this;
        _this.lockCounter = 0;
        _this.count = 0;
        _this.spawnStartVelocity = Vector2.zero;
        _this.spawnFunction = spawnFunction;
        _this.maxCount = maxCount;
        _this.defaultLockCounter = lockCounter;
        _this.dimensions = new Vector2(8, 8);
        _this.probability = probability;
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
            var spawn = this.spawnFunction(this.parent, this.spawnStartVelocity);
            spawn.position = new Vector2(Tools.getRandomFloat(this.position.x, this.position.x + this.dimensions.x), Tools.getRandomFloat(this.position.y, this.position.y + this.dimensions.y));
            this.lockCounter = this.defaultLockCounter;
            this.count++;
        }
    };
    return SpawnBox;
}(GameObject));
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
    function printRight(engine, str, x, y, color, fixed, scale) {
        var width = engine.print(str, 0, -6);
        return engine.print(str, (x - width), y);
    }
    Tools.printRight = printRight;
    function printCentered(engine, str, x, y, color, fixed, scale) {
        var width = engine.print(str, 0, -6);
        x = x == undefined ? 240 : x;
        y = y == undefined ? 136 : y;
        return engine.print(str, (x - width) / 2, (y) / 2);
    }
    Tools.printCentered = printCentered;
    function unique() {
        return Math.random().toString(36);
    }
    Tools.unique = unique;
})(Tools || (Tools = {}));
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
            _this._solidTiles = [1];
            return _this;
        }
        Solid.prototype.update = function (tic) {
        };
        Solid.prototype.collide = function (position, velocity, dimensions) {
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
            var spriteNumber = this.gameObject.game.engine.mget(Math.floor((x / 8) + this.gameObject.game.mapOffset.x), Math.floor(((y) / 8) + this.gameObject.game.mapOffset.y));
            var collision = this._solidTiles.indexOf(spriteNumber) >= 0;
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
/// <reference path="./../Component.ts" />
var Components;
(function (Components) {
    var Visible = /** @class */ (function (_super) {
        __extends(Visible, _super);
        function Visible() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = 14;
            return _this;
        }
        Visible.prototype.draw = function () {
            var globalPosition = this.gameObject.getGlobalPosition();
            this.gameObject.game.engine.rect(globalPosition.x, globalPosition.y, this.gameObject.dimensions.x, this.gameObject.dimensions.y, this.color);
            if (this.gameObject.velocity.x > 0) {
                this.gameObject.game.engine.rect(globalPosition.x + this.gameObject.dimensions.x, globalPosition.y, Tools.normalize(this.gameObject.velocity.x), this.gameObject.dimensions.y, 11);
            }
            else {
                this.gameObject.game.engine.rect(globalPosition.x - Tools.normalize(Math.abs(this.gameObject.velocity.x)), globalPosition.y, Tools.normalize(Math.abs(this.gameObject.velocity.x)), this.gameObject.dimensions.y, 11);
            }
            for (var _i = 0, _a = this.gameObject.childrenByComponent(ComponentFlags.Visible); _i < _a.length; _i++) {
                var child = _a[_i];
                child.components.visible.draw();
            }
        };
        return Visible;
    }(Component));
    Components.Visible = Visible;
})(Components || (Components = {}));
/// <reference path="./../Engine/GameObject.ts" />
var BloodParticle = /** @class */ (function (_super) {
    __extends(BloodParticle, _super);
    function BloodParticle(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid) || this;
        _this.liveCounter = 50;
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
/// <reference path="./../Engine/BaseGame.ts" />
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Game.prototype.init = function () {
        this.gameState = GameTitle.id;
        this.gameStates = {};
        this.gameStates[GameTitle.id] = new GameTitle(this);
        this.gameStates[GamePlay.id] = new GamePlay(this);
        this.gameStates[GameOver.id] = new GameOver(this);
        this.initializeGameObjectCollections();
        this.root.reset();
        this.player = Player.create(this.root);
        this.player.position = new Vector2(115, 70);
        Sword.create(this.player);
        var leftSpawnSpid = new SpawnBox(this.root, "LeftSpawnSpid", Enemies.Spid.create, 10, 7, 0.6);
        leftSpawnSpid.position = new Vector2(7, 80);
        leftSpawnSpid.dimensions = new Vector2(1, 4);
        leftSpawnSpid.spawnStartVelocity = new Vector2(Tools.getRandomFloat(1.8, 2.5), 0);
        var rightSpawnSpid = new SpawnBox(this.root, "RightSpawnSpid", Enemies.Spid.create, 10, 7, 0.6);
        rightSpawnSpid.position = new Vector2(232, 80);
        rightSpawnSpid.dimensions = new Vector2(1, 4);
        rightSpawnSpid.spawnStartVelocity = new Vector2(Tools.getRandomFloat(-1.8, -2.5), 0);
        var topSpawnSpid = new SpawnBox(this.root, "TopSpawnSpid", Enemies.Spid.create, 10, 7, 0.6);
        topSpawnSpid.position = new Vector2(110, 50);
        topSpawnSpid.dimensions = new Vector2(20, 4);
        topSpawnSpid.spawnStartVelocity = new Vector2(Tools.getRandomFloat(0, 0), 0);
        this.mapOffset = new Vector2(0, 0);
        this.gravity = 0.2;
    };
    return Game;
}(BaseGame));
/// <reference path="./../Engine/GameState.ts" />
var GameOver = /** @class */ (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameOver.prototype.update = function (tic) {
        Tools.printCentered(this.game.engine, "GAME OVER");
        if (this.game.engine.btnp(Button.X)) {
            this.game.init();
        }
    };
    GameOver.id = "gameover";
    return GameOver;
}(GameState));
/// <reference path="./../Engine/GameState.ts" />
var GamePlay = /** @class */ (function (_super) {
    __extends(GamePlay, _super);
    function GamePlay() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GamePlay.prototype.update = function (tic) {
        this.game.root.update(tic);
        this.game.engine.cls();
        this.renderMap();
        this.game.root.draw();
        this.renderUI();
    };
    GamePlay.prototype.renderMap = function () {
        this.game.engine.map(this.game.mapOffset.x, this.game.mapOffset.y);
    };
    GamePlay.prototype.renderUI = function () {
        for (var i = 0; i < this.game.player.components.actor.hitPoints; i++) {
            this.game.engine.print("*", i * 8, 0);
        }
        Tools.printRight(this.game.engine, "SCORE: " + this.game.player.score.toString(), 240, 0);
        Tools.printCentered(this.game.engine, "HI-SCORE: " + this.game.hiScore.toString(), undefined, 0);
        for (var i = 0; i < this.game.getGameObjectCollection(Enemies.Spid.spidsCollectionId).length; i++) {
            var spid = this.game.getGameObjectCollection(Enemies.Spid.spidsCollectionId)[i];
        }
    };
    GamePlay.id = "gameplay";
    return GamePlay;
}(GameState));
/// <reference path="./../Engine/GameState.ts" />
var GameTitle = /** @class */ (function (_super) {
    __extends(GameTitle, _super);
    function GameTitle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameTitle.prototype.update = function (tic) {
        this.game.gameState = GamePlay.id;
    };
    GameTitle.id = "gametitle";
    return GameTitle;
}(GameState));
/// <reference path="./../Engine/GameObject.ts" />
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
        this.game.gameState = GameOver.id;
        if (this.game.hiScore < this.score) {
            this.game.hiScore = this.score;
        }
    };
    Player.prototype.onHit = function (hitter) {
        if (this.hurtTimer == 0) {
            this.velocity.x = this.hurtJumpVector.x;
            this.velocity.y = this.hurtJumpVector.y;
            this.components.actor.hitPoints -= 1;
            this.hurtTimer = this.hurtTimerValue;
        }
    };
    Player.prototype.onUpdate = function () {
        this.velocity.y = this.velocity.y + this.game.gravity;
        if (this.hurtTimer > 0) {
            this.hurtTimer -= 1;
        }
        var collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
        if (collidingObject != null) {
            if (this.states[Moves.Dash.stateKey]) {
                collidingObject.onHit(this);
                if (collidingObject.components.actor.isDead()) {
                    this.score += collidingObject.components.actor.scoreValue;
                }
            }
            else {
                this.onHit(collidingObject);
            }
        }
        if (this.hurtTimer == 0) {
            if (this.velocity.x <= this.defaultVelocity.x && this.velocity.x >= -this.defaultVelocity.x) {
                if (this.game.engine.btn(Button.Left)) {
                    this.velocity.x = -this.defaultVelocity.x;
                }
                else if (this.game.engine.btn(Button.Right)) {
                    this.velocity.x = this.defaultVelocity.x;
                }
                else {
                    this.velocity.x = 0;
                }
            }
            if (this.components.solid.grounded && this.game.engine.btnp(Button.A)) {
                this.velocity.y = -2.7;
            }
        }
        if (this.velocity.x > this.defaultVelocity.x) {
            this.velocity.x -= 0.2;
        }
        else if (this.velocity.x < -this.defaultVelocity.x) {
            this.velocity.x += 0.2;
        }
        this.components.visible.color = 15;
        if (this.states[Moves.Dash.stateKey]) {
            this.components.visible.color = 8;
        }
        if (this.hurtTimer > 0) {
            this.components.visible.color = 6;
        }
    };
    Player.create = function (parent) {
        var player = new Player(parent, "player" + Tools.unique());
        player.position = new Vector2(115, 70);
        player.components.visible.color = 15;
        player.dimensions = new Vector2(8, 8);
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
/// <reference path="./../../Engine/GameObject.ts" />
var Enemies;
(function (Enemies) {
    var Spid = /** @class */ (function (_super) {
        __extends(Spid, _super);
        function Spid(parent, id, target) {
            var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Solid | ComponentFlags.Actor) || this;
            _this.jumpSpeed = -2;
            _this.blockedFromAbove = false;
            _this.blockedFromBottom = false;
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
        Spid.prototype.onUpdate = function () {
            var stoppedAtFrameStart = (this.velocity.x == 0 && this.velocity.y == 0);
            var blocked = false;
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
            if ((stoppedAtFrameStart && this.components.solid.grounded)
                || (stoppedAtFrameStart && this.canJumpOnOtherSpid)) {
                this.velocity.y = this.jumpSpeed;
            }
            this.blockedFromAbove = false;
            this.blockedFromBottom = false;
            this.canJumpOnOtherSpid = false;
            for (var i = 0; i < this._spids.length; i++) {
                var otherSpid = this._spids[i];
                if (this != otherSpid) {
                    if (BoundingBoxCollider.overlaps(this.position, this.velocity, this.dimensions, otherSpid.position, otherSpid.dimensions)) {
                        if (this.position.y >= otherSpid.position.y + otherSpid.dimensions.y - 1) {
                            this.blockedFromAbove = true;
                        }
                        if (this.position.y + this.dimensions.y <= otherSpid.position.y) {
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
            if (this.blockedFromAbove || this.blockedFromBottom) {
                this.velocity.y = 0;
            }
        };
        Spid.prototype.onHit = function (hitter) {
            this.components.actor.hitPoints -= 1;
            if (this.components.actor.isDead()) {
                this.killerVelocity = hitter.velocity.copy();
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
                if (this.killerVelocity != null) {
                    xVelocity = this.killerVelocity.x;
                }
                else {
                    xVelocity = (i * 1.5) - 2;
                }
                var yVelocity = -i;
                bloodParticle.velocity = new Vector2(xVelocity, yVelocity);
                bloodParticle.dimensions = new Vector2(2, 2);
                bloodParticle.components.visible.color = 6;
            }
        };
        Spid.create = function (parent, startVelocity) {
            var player = parent.game.root.childrenByTag(GameObjectTags.Player)[0];
            var spid = new Enemies.Spid(parent, "spid" + Tools.unique(), player);
            spid.components.visible.color = 6;
            spid.dimensions = new Vector2(4, 4);
            spid.defaultVelocity = new Vector2(0.4, 0);
            spid.velocity = startVelocity.copy();
            spid.components.actor.hitPoints = 1;
            spid.components.visible.color = Tools.getRandomInt(1, 15);
            parent.game.getGameObjectCollection(Spid.spidsCollectionId).push(spid);
            return spid;
        };
        Spid.spidsCollectionId = "spids";
        return Spid;
    }(GameObject));
    Enemies.Spid = Spid;
})(Enemies || (Enemies = {}));
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
        Dash.prototype.onUpdate = function () {
            if (this.game.engine.btnp(Button.B)) {
                if (this.parent.velocity.x == this.parent.defaultVelocity.x) {
                    this.parent.velocity.x = 4;
                    this.parent.states[Dash.stateKey] = true;
                }
                else if (this.parent.velocity.x == -this.parent.defaultVelocity.x) {
                    this.parent.velocity.x = -4;
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
/// <reference path="./../../Engine/GameObject.ts" />
var Sword = /** @class */ (function (_super) {
    __extends(Sword, _super);
    function Sword(parent, id) {
        var _this = _super.call(this, parent, id, ComponentFlags.Visible | ComponentFlags.Actor) || this;
        _this.attackPhase = 0;
        _this.defaultPosition = Vector2.zero;
        _this.tags |= GameObjectTags.Weapon;
        return _this;
    }
    Sword.prototype.onUpdate = function () {
        if (this.parent.velocity.x > 0 && this.position.x < 0
            || this.parent.velocity.x < 0 && this.position.x > 0) {
            this.position.x *= -1;
        }
        if (this.game.engine.btnp(Button.X)) {
            if (this.attackPhase == 0) {
                this.attackPhase += 1;
            }
        }
        if (this.attackPhase == 1) {
            if (Math.abs(this.position.x) < 10) {
                this.position.x += this.position.x > 0 ? 2 : -2;
            }
            else {
                this.attackPhase += 1;
            }
        }
        if (this.attackPhase == 2) {
            if (Math.abs(this.position.x) > this.defaultPosition.x) {
                this.position.x += this.position.x > 0 ? -2 : 2;
            }
            else {
                this.attackPhase = 0;
            }
        }
        if (this.attackPhase != 0) {
            var collidingObject = this.components.actor.getFirstObjectCollision(GameObjectTags.Enemy);
            if (collidingObject != null) {
                collidingObject.onHit(this);
                if (collidingObject.components.actor.isDead()) {
                    this.parent.score += collidingObject.components.actor.scoreValue;
                }
            }
        }
    };
    Sword.create = function (parent) {
        var sword = new Sword(parent, "sword" + Tools.unique());
        sword.dimensions = new Vector2(8, 2);
        sword.defaultPosition = new Vector2(2, 3);
        sword.position = sword.defaultPosition.copy();
        return sword;
    };
    return Sword;
}(GameObject));
/// <reference path="../Engine/IApi.ts" />
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
//# sourceMappingURL=compiled.js.map