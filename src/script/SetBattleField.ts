export default class SetBattleFied extends Laya.Script{
    m_battleBoxes: Laya.Sprite[] = [];
    m_ninjaSelf: Laya.Animation;
    m_currentPos: object;
    // m_targetPos: object;
    m_clicked: boolean = false;

    onStart():void{
        console.log('開始建設場景單位');
        this.setUnitBox();
        this.setNinjaPos();
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
                        // this.m_ninjaSelf.pos(box.x, box.y);
                        Laya.Tween.to(this.m_ninjaSelf, {
                            x: box.x,
                            y: box.y,
                        }, 150, Laya.Ease.linearInOut);
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
    setNinjaPos():void{
        let index: number = Math.floor(Math.random() * this.m_battleBoxes.length+1);
        let randomDot: Laya.Sprite = this.m_battleBoxes[index];
        this.m_ninjaSelf = new Laya.Animation();
        this.m_ninjaSelf.source = "image/ninja.png";
        this.m_ninjaSelf.play();
        this.m_ninjaSelf.width = this.m_ninjaSelf.height = 120;
        this.m_ninjaSelf.zOrder = 50000;
        this.m_ninjaSelf.pos(randomDot.x, randomDot.y);
        
        this.m_ninjaSelf.on(Laya.Event.CLICK, this, ()=>{
            this.m_clicked = !this.m_clicked;
            this.m_ninjaSelf.alpha = this.m_clicked ? 0.2 : 1;
        });
        
        console.log('Ninja pos: x: ' + this.m_ninjaSelf.x + ' y: ' + this.m_ninjaSelf.y);
        Laya.stage.addChild(this.m_ninjaSelf);
    }
}