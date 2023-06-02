import Matter, {Bodies, Composite, Engine} from "matter-js";
import p5 from 'p5'

interface BirdConfig {
    sprite: any
    density: number
    scale: number
    radius: number
}

export class Bird {
    public config: any;
    public readonly body: Matter.Body;
    private p5: p5;
    private readonly images: Array<HTMLImageElement>;

    constructor(p5: p5, engine: Engine, birdImgs: Array<any>, x: number, y: number, birdType = 1) {
        this.p5 = p5
        this.images = birdImgs
        const typeConfigMap: { [key: number]: BirdConfig } = {
            1: {
                sprite: birdImgs[0],
                density: 0.001,
                scale: 0.035,
                radius: 45,
            },
            // 2: {
            //     sprite: 'cdn/bird2.png',
            //     density: 0.0008,
            //     scale: 0.035,
            //     radius: 14,
            // },
            // 3: {
            //     sprite: 'cdn/bird3.png',
            //     density: 0.003,
            //     scale: 0.045,
            //     radius: 20,
            // },
        };

        const birdConfig = this.config = typeConfigMap[birdType];

        this.body = Bodies.circle(x, y, birdConfig.radius, {
            label: 'Bird',
            restitution: 0.4,
            density: this.config.density,
            render: {
                fillStyle: 'red',
                sprite: {
                    texture: birdConfig.sprite,
                    xScale: birdConfig.scale,
                    yScale: birdConfig.scale,
                },
            },
        });
        Composite.add(engine.world, this.body);
    }

    show() {
        const pos = this.body.position
        const angle = this.body.angle
        this.p5.push()
        this.p5.translate(pos.x, pos.y)
        this.p5.rotate(angle)
        this.p5.rectMode(this.p5.CENTER)
        this.p5.imageMode(this.p5.CENTER)
        this.p5.image(this.config.sprite, 0, 0, this.config.radius, this.config.radius)
        this.p5.pop()
    }
}

