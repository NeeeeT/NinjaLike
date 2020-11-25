(function () {
    'use strict';

    class SetBattleFied extends Laya.Script {
        constructor() {
            super(...arguments);
            this.m_battleBoxes = [];
            this.m_ninjaAI = new Laya.Animation();
            this.m_clicked = false;
            this.m_movingTimer = null;
        }
        onStart() {
            console.log('開始建設場景單位');
            this.setUnitBox();
            this.setNinja();
            this.setNinjaAI();
        }
        setUnitBox() {
            for (let i = 0; i < 16; i++) {
                for (let j = 0; j < 9; j++) {
                    let box = new Laya.Sprite();
                    box.loadImage("scene/unitBox.png");
                    box.pos(i * 120, j * 120);
                    box.on(Laya.Event.CLICK, this, () => {
                        if (this.m_clicked) {
                            if (!(box.x === this.m_ninjaSelf.x || box.y === this.m_ninjaSelf.y))
                                return;
                            Laya.Tween.to(this.m_ninjaSelf, {
                                x: box.x,
                                y: box.y,
                            }, 150);
                            this.m_clicked = false;
                            this.m_ninjaSelf.alpha = this.m_clicked ? 0.2 : 1;
                        }
                    });
                    Laya.stage.addChild(box);
                    this.m_battleBoxes.push(box);
                }
            }
            console.log('場景單位建設完畢');
            console.log(this.m_battleBoxes);
        }
        setNinja() {
            let index = Math.floor(Math.random() * this.m_battleBoxes.length + 1);
            let randomDot = this.m_battleBoxes[index];
            this.m_ninjaSelf = new Laya.Animation();
            this.m_ninjaSelf.source = "image/ninja.png";
            this.m_ninjaSelf.play();
            this.m_ninjaSelf.width = this.m_ninjaSelf.height = 120;
            this.m_ninjaSelf.zOrder = 50;
            this.m_ninjaSelf.pos(randomDot.x, randomDot.y);
            let rig = this.m_ninjaSelf.addComponent(Laya.RigidBody);
            let col = this.m_ninjaSelf.addComponent(Laya.CircleCollider);
            let scr = this.m_ninjaSelf.addComponent(Laya.Script);
            rig.gravityScale = 0;
            rig.bullet = true;
            col.label = 'ninjaSelf';
            scr.onTriggerEnter = (col) => {
                if (col.label === 'ninjaAI') {
                    col.owner.destroy();
                    setTimeout(() => {
                        this.setNinjaAI();
                    }, 1000);
                }
            };
            this.m_ninjaSelf.on(Laya.Event.CLICK, this, () => {
                this.m_clicked = !this.m_clicked;
                this.m_ninjaSelf.alpha = this.m_clicked ? 0.2 : 1;
            });
            console.log('Ninja pos: x: ' + this.m_ninjaSelf.x + ' y: ' + this.m_ninjaSelf.y);
            Laya.stage.addChild(this.m_ninjaSelf);
        }
        setNinjaAI() {
            let index = Math.floor(Math.random() * this.m_battleBoxes.length + 1);
            let randomDot = this.m_battleBoxes[index];
            this.m_ninjaAI = new Laya.Animation();
            this.m_ninjaAI.source = "image/ninja.png";
            this.m_ninjaAI.play();
            this.m_ninjaAI.width = this.m_ninjaSelf.height = 120;
            this.m_ninjaAI.zOrder = 50;
            this.m_ninjaAI.alpha = 0.5;
            this.m_ninjaAI.pos(randomDot.x, randomDot.y);
            let rig = this.m_ninjaAI.addComponent(Laya.RigidBody);
            let col = this.m_ninjaAI.addComponent(Laya.CircleCollider);
            let scr = this.m_ninjaAI.addComponent(Laya.Script);
            col.label = 'ninjaAI';
            rig.gravityScale = 0;
            rig.bullet = true;
            this.m_ninjaAI.on(Laya.Event.CLICK, this, () => {
            });
            console.log('NinjaAI pos: x: ' + this.m_ninjaAI.x + ' y: ' + this.m_ninjaAI.y);
            Laya.stage.addChild(this.m_ninjaAI);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/SetBattleField.ts", SetBattleFied);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "battleField.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
