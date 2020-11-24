export abstract class EnemyAI extends Laya.Script{
    abstract m_name: string;
    abstract m_health: number;
    abstract m_mana: number;
    abstract m_dmg: number;
    abstract m_image: string;

    spawn(): void{
    }
    setPos(): void{
    }
}

export class EnemyNewbie extends EnemyAI{
    m_name = '初心者';
    m_health = 100;
    m_mana = 100;
    m_dmg = 10;
    m_image = 'image/NinjaNewbie.png';
}