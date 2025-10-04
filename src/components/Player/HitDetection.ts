



export function checkHit(object: any, target: any, shouldReturnTarget = false) {
    if (!object || !target) return false; // Ensure both objects are defined
    const bounds1 = object.getBounds();
    const bounds2 = target.getBounds();

    if (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
    ) return shouldReturnTarget
        ? { hit: true, target, object }
        : true

    return shouldReturnTarget
        ? { hit: false, target, object }
        : false; // No hit
}

export function checkHitMultiple(
    objects: any[],
    target: any,
    shouldReturnTarget: boolean = false,
    shouldReturnOnFirstHit: boolean = true
) {
    let hit = [];
    for (const object of objects) {
        const hitResult = checkHit(object, target, shouldReturnTarget);
        if (!hitResult) continue;

        hit.push(hitResult);
        if (shouldReturnOnFirstHit) return [hitResult]
    }
    return hit.length > 0 ? hit : false; // Return all hits or false if no hits
}

export type HitObjectWithId = { id: string, ref: React.RefObject<any> };

export function checkHitMultipleWithId(
    objects: HitObjectWithId[],
    target: React.RefObject<any> | null,
    shouldReturnTarget: boolean = false,
    shouldReturnOnFirstHit: boolean = true
): HitObjectWithId[] | false {
    let hit = [];
    if (!target) return false;
    for (const object of objects) {
        const hitResult = checkHit(object.ref.current, target, shouldReturnTarget);
        if (!hitResult) continue;

        hit.push(object);
        if (shouldReturnOnFirstHit) return [object]
    }
    return hit.length > 0 ? hit : false; // Return all hits or false if no hits
}