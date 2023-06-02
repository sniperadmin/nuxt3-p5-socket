import Matter, {Bodies, Composite, World} from "matter-js";
import p5 from 'p5'
import {Box} from "~/utils/types/box";

export class Ground extends Box {
    body: Matter.Body
    constructor(p5: p5, world: World, image: any, x: number, y: number, w: number, h: number) {
        super(p5, world, image, x, y, w, h)
        this.body = Bodies.rectangle(x, y, w, h, {
            label: 'Ground',
            isStatic: true
        })
        Composite.add(world, this.body)
    }
}
