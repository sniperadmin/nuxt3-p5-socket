import p5 from 'p5'
import {Bodies, World, Body, Composite} from "matter-js";

export class Box {
    w: number;
    h: number;
    p5: p5
    body: Body;
    private image: any;

    constructor(p5: p5, world: World, image: any, x: number, y: number, w: number, h: number) {
        this.p5 = p5
        this.image = image
        this.body = Bodies.rectangle(x, y, w, h)
        Composite.add(world, this.body)
        this.w = w
        this.h = h
    }

    show() {
        const pos = this.body.position
        const angle = this.body.angle
        this.p5.push()
        this.p5.translate(pos.x, pos.y)
        this.p5.rotate(angle)
        this.p5.rectMode(this.p5.CENTER)
        console.log('body label is => ', this.body.label)
        if (this.body.label === 'Ground') {
            this.p5.fill(100)
            this.p5.rect(0 , 0, this.w, this.h)
        } else {
            this.p5.imageMode(this.p5.CENTER)
            this.p5.image(this.image, 0, 0, this.w, this.h)
        }
        this.p5.pop()
    }
}
