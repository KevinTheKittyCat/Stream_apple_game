


/*

export const talentData = [
    {
        id: "talent1",
        "name": "Talent 1",
        "description": "Description for Talent 1",
        "icon": "/assets/icons/talent1.png",
        "cost": 100,
        "effect": "Increases speed by 10%",
        "type": "speed",
        "connectedTo": ["talent2", "talent3"],
        "prerequisite": [{ "id": "talent2", "points": 3 }, { "id": "talent3", "points": 2 }],
        "isAvailable": true,
    },
]


export const techs = [
    { id: 'mining', requires: [] },
    { id: 'smelting', requires: ['mining'] },
    { id: 'steel', requires: ['smelting'] },
    { id: 'automation', requires: ['steel', 'electronics'] },
    { id: 'electronics', requires: ['smelting'] }
];

const buildGraph = (techs) => {
    const graph = new Map();
    techs.forEach(t => graph.set(t.id, { ...t, children: [], parents: [] }));

    techs.forEach(t => {
        t.requires.forEach(req => {
            graph.get(req).children.push(t.id);
            graph.get(t.id).parents.push(req);
        });
    });
    return graph;
}

function assignDepths(graph) {
    const depths = {};
    function dfs(nodeId) {
        if (depths[nodeId] !== undefined) return depths[nodeId];
        const parents = graph.get(nodeId).parents;
        depths[nodeId] = parents.length === 0
            ? 0
            : Math.max(...parents.map(dfs)) + 1;
        return depths[nodeId];
    }
    for (const id of graph.keys()) dfs(id);
    return depths;
}

export const createTalentTree = (techs) => {
    const graph = buildGraph(techs);
    if (graph.size === 0) return { nodes: [], links: [] };

    const depths = assignDepths(graph);

    // Group nodes by depth
    const depthGroups = {};
    for (const [id, depth] of Object.entries(depths)) {
        (depthGroups[depth] ??= []).push(id);
    }

    // Create nodes list with positions
    const nodes = Object.entries(depthGroups).flatMap(([depth, ids]) =>
        ids.map((id, i) => ({
            id,
            position: { x: depth * 250, y: i * 150 }
        }))
    );

    // Quick lookup for positions
    const posMap = Object.fromEntries(nodes.map(n => [n.id, n.position]));

    // Build links between prerequisite and child
    const links = [];
    for (const tech of techs) {
        for (const req of tech.requires) {
            const fromPos = posMap[req];
            const toPos = posMap[tech.id];
            if (!fromPos || !toPos) continue;

            // Middle of node (matching Talent component outer size)
            const nodeWidth = 50;
            const nodeHeight = 50;

            const fromX = fromPos.x + nodeWidth / 2;
            const fromY = fromPos.y + nodeHeight / 2;
            const toX = toPos.x + nodeWidth / 2;
            const toY = toPos.y + nodeHeight / 2;

            links.push({
                from: req,
                to: tech.id,
                points: [fromX, fromY, toX, toY]
            });
        }
    }

    return { nodes, links };
};


*/