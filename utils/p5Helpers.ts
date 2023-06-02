import p5 from 'p5'

/**
 * Particle
 * @param {object} p p5 instance
 * @param {object} options particleOptions
 */
export function Particle (this: any, p: p5, options: any) {
    this.options = Object.assign({
        acc: { x: 0, y: 0 },
        speed: { x: 0, y: 0 },
        position: { x: 0, y: 0 },
        // width: 10,
        // height: 10,
        angle: 0,
        rotateSpeed: 0,
        opacity: 1,
        radius: 10,
        life: -1, // -1: infinite
    }, options);
    const { acc, speed, position, angle, rotateSpeed, life } = this.options;
    this.p = p;
    this.graphic = this.initGraphic();
    this.acceleration = p.createVector(acc.x, acc.y);
    this.velocity = p.createVector(speed.x, speed.y);
    this.position = p.createVector(position.x, position.y);
    this.rotateSpeed = rotateSpeed;
    this.angle = angle;
    this.life = life;
};

Particle.prototype.initGraphic = function() {
    const { p, options } = this;
    const { radius, image } = options;
    const graphic = p.createGraphics(radius * 2, radius * 2);
    if (image) {
        graphic.image(image, -1, 0, radius * 2 + 2, radius * 2);
    }
    return graphic;
};

Particle.prototype.run = function() {
    this.update();
    this.display();
};

Particle.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.angle += this.rotateSpeed;
    if (this.life === -1) return;
    this.life -= 1;
    if (this.life <= 0) {
        this.onDead && this.onDead();
    }
};

Particle.prototype.display = function() {
    const { p, graphic, position, options, angle } = this;
    const { radius, opacity, width, height, image } = options;
    if (image) {
        // rotate image with graphic
        p.imageMode(p.CENTER);
        p.push();
        p.translate(position.x, position.y);
        p.rotate(p.PI/180 * angle);
        p.image(graphic, 0, 0);
        p.pop();
        return;
    }
    p.stroke(255, 0);
    p.strokeWeight(1);
    p.fill(255, opacity * 255);
    if (radius) {
        p.circle(position.x, position.y, radius);
    } else {
        p.ellipse(position.x, position.y, width, height);
    }
};


/**
 * createProcess
 * @param {object} processOptions
 */
export function createProcess(processOptions: any) {
    // @ts-ignore
    return new CanvasProcess(processOptions);
}

function CanvasProcess(this: any, processOptions: any) {
    // const self = this;
    this.options = processOptions;
    this.items = [];
    this.app = null;
    this.context = null;
}

CanvasProcess.prototype.init = function initProcess(app: any, context: any) {
    const { options } = this;
    this.app = app;
    this.context = context;
    options.beforeSetup && options.beforeSetup.call(this, app, context);
}

CanvasProcess.prototype.create = function createItem(...args: any) {
    const { options, app, context } = this;
    if (options.create) {
        return options.create.apply(this, [app, context, ...args]);
    }
}

CanvasProcess.prototype.setup = function setupItem(...args: any) {
    const { options, app, context } = this;
    if (options.setup) {
        options.setup.apply(this, [app, context, ...args]);
    }
}

CanvasProcess.prototype.draw = function drawItem(...args: any) {
    const { options, app, context } = this;
    if (options.draw) {
        options.draw.apply(this, [app, context, ...args]);
    }
}


/**
 * createSketch
 * @param {object} options
 */
function createSketch(options: any) {
    const { width, height, bgColor = 255, container, on } = options;
    return (p: p5) => {
        // setup
        p.setup = function setupCanvas() {
            p.createCanvas(width || p.windowWidth, height || p.windowHeight);
            // p.pixelDensity(1);
            for (let i = 0; i < container.length; i++) {
                const process = container[i];
                process.setup();
            }
        };

        // draw
        p.draw = function drawCanvas() {
            p.background(bgColor);
            if (!options.animateState) return;
            for (let i = 0; i < container.length; i++) {
                const process = container[i];
                process.draw();
            }
        };

        // events or other p5 function
        for (let key in on) {
            (p as any)[key] = function(event: any) {
                on[key].call(p, event, p, options);
                // loop process event
                for (let i = 0; i < container.length; i++) {
                    const process = container[i];
                    if (!process.options.on) continue;
                    if (process.options.on[key]) {
                        process.options.on[key].call(process, event, p, options);
                    }
                }
            };
        }
    };
}


/**
 * useP5
 * @param {object} options
 */
export function useP5(options: any) {
    let app: any;
    const processContainer = options.container = [];
    const sketch = createSketch(options);
    const context = options;

    function initCanvas(container: any) {
        app = new p5(sketch, container);
        return app;
    }

    function addProcess(...processes: any[]) {
        for (let i = 0; i < processes.length; i++) {
            processes[i].init(app, context);
        }
        // @ts-ignore
        processContainer.push(...processes);
    }

    function startAnimate() {
        options.animateState = true;
    }

    return {
        startAnimate,
        initCanvas,
        addProcess,
    };
}
