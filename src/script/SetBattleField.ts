export default class SetBattleFied extends Laya.Script{
    m_battleBoxes: Laya.Sprite[] = [];
    m_ninjaSelf: Laya.Animation;
    m_ninjaAI: Laya.Animation = new Laya.Animation();
    m_currentPos: object;

    m_clicked: boolean = false;
    m_movingTimer = null;

    onStart():void{
        console.log('開始建設場景單位');
        this.setUnitBox();
        this.setNinja();
        this.setNinjaAI();
    }
    setUnitBox(){
        for(let i = 0; i < 16; i++){
            for(let j = 0; j < 9; j++){
                let box = new Laya.Sprite();
                box.loadImage("scene/unitBox.png");
                box.pos(i*120, j*120);
                box.on(Laya.Event.CLICK, this, ()=>{
                    if(this.m_clicked){
                        if(!(box.x === this.m_ninjaSelf.x || box.y === this.m_ninjaSelf.y)) return;
                        // this.m_movingTimer = setInterval(()=>{
                        //     if(Math.abs(this.m_ninjaAI.x - this.m_ninjaSelf.x) < 50
                        //         && Math.abs(this.m_ninjaAI.y - this.m_ninjaSelf.y) < 50){
                        //         this.m_ninjaAI.destroy();
                        //         this.m_ninjaAI.destroyed = true;
                        //         setTimeout(()=>{ this.setNinjaAI(); }, 1000);
                        //         clearInterval(this.m_movingTimer);
                        //         this.m_movingTimer = null;
                        //         return;
                        //     }
                        // }, 10);
                        Laya.Tween.to(this.m_ninjaSelf, {
                            x: box.x,
                            y: box.y,
                        }, 150);
                        this.m_clicked = false;
                        this.m_ninjaSelf.alpha = this.m_clicked ? 0.2 : 1;
                    }
                })
                Laya.stage.addChild(box);
                this.m_battleBoxes.push(box);
            }
        }
        console.log('場景單位建設完畢');
        console.log(this.m_battleBoxes);
    }
    setNinja():void{
        let index: number = Math.floor(Math.random() * this.m_battleBoxes.length+1);
        let randomDot: Laya.Sprite = this.m_battleBoxes[index];
        this.m_ninjaSelf = new Laya.Animation();
        this.m_ninjaSelf.source = "image/ninja.png";
        this.m_ninjaSelf.play();
        this.m_ninjaSelf.width = this.m_ninjaSelf.height = 120;
        this.m_ninjaSelf.zOrder = 50;
        this.m_ninjaSelf.pos(randomDot.x, randomDot.y);

        let rig = this.m_ninjaSelf.addComponent(Laya.RigidBody) as Laya.RigidBody;
        let col = this.m_ninjaSelf.addComponent(Laya.CircleCollider) as Laya.CircleCollider;
        let scr = this.m_ninjaSelf.addComponent(Laya.Script) as Laya.Script;

        rig.gravityScale = 0;
        col.label = 'ninjaSelf';
        scr.onTriggerEnter = (col: Laya.CircleCollider) =>{
            if(col.label === 'ninjaAI'){
                col.owner.destroy();
                setTimeout(()=>{
                    this.setNinjaAI();
                }, 1000)
            }
        }
             
        this.m_ninjaSelf.on(Laya.Event.CLICK, this, ()=>{
            this.m_clicked = !this.m_clicked;
            this.m_ninjaSelf.alpha = this.m_clicked ? 0.2 : 1;
        });
        
        console.log('Ninja pos: x: ' + this.m_ninjaSelf.x + ' y: ' + this.m_ninjaSelf.y);
        Laya.stage.addChild(this.m_ninjaSelf);
    }
    setNinjaAI(): void{

        let index: number = Math.floor(Math.random() * this.m_battleBoxes.length+1);
        let randomDot: Laya.Sprite = this.m_battleBoxes[index];
        this.m_ninjaAI = new Laya.Animation();
        this.m_ninjaAI.source = "image/ninja.png";
        this.m_ninjaAI.play();
        this.m_ninjaAI.width = this.m_ninjaSelf.height = 120;
        this.m_ninjaAI.zOrder = 50;
        this.m_ninjaAI.alpha = 0.5;
        this.m_ninjaAI.pos(randomDot.x, randomDot.y);

        let rig = this.m_ninjaAI.addComponent(Laya.RigidBody) as Laya.RigidBody;
        let col = this.m_ninjaAI.addComponent(Laya.CircleCollider) as Laya.CircleCollider;
        let scr = this.m_ninjaAI.addComponent(Laya.Script) as Laya.Script;

        col.label = 'ninjaAI';
        rig.gravityScale = 0;
         
        this.m_ninjaAI.on(Laya.Event.CLICK, this, ()=>{
        });
        
        console.log('NinjaAI pos: x: ' + this.m_ninjaAI.x + ' y: ' + this.m_ninjaAI.y);
        console.log(123);
        
        Laya.stage.addChild(this.m_ninjaAI);
    }
}