import Matter, {Bodies, Constraint, IConstraintDefinition, World} from "matter-js";
import p5 from 'p5'

export class Slingshot {
    private readonly sling: Constraint;
    private p5: p5;

    constructor(p5: p5, world: World, x: number, y: number, body: Matter.Body) {
        this.p5 = p5
        const options: IConstraintDefinition = {
            pointA: { x: x, y: y },
            bodyB: body,
            stiffness: 0.02,
            length: 80
        }
        this.sling = Constraint.create(options)
        World.add(world, this.sling)
    }

    detach() {
        this.sling.bodyB = null
    }

    attach(body: Matter.Body) {
        this.sling.bodyB = body
    }

    show() {
        if (this.sling.bodyB) {
            this.p5.stroke(200)
            const posA = this.sling.pointA
            const posB = this.sling.bodyB.position
            this.p5.line(posA.x, posA.y, posB.x, posB.y)
        }
    }
}
