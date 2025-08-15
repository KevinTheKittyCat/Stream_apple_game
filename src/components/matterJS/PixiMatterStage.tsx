import { Application } from '@pixi/react';
import { MatterContextProvider } from "./MatterContext";
import * as Matter from "matter-js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

export default function PixiMatterStage({ children }: { children: React.ReactNode }) {




    return (
        <>
            <MatterContextProvider>
                <Application eventMode='static' resizeTo={window}>
                    {children}
                </Application>
            </MatterContextProvider>
        </>
    );
}
