export const findClosestReachableApple = ({
    apples, 
    ref,
    refOffset = { x: 0, y: 0 },
    appleOffset = { x: 0, y: 0 }
}: {
    apples: { id: string, ref: React.RefObject<any> }[],
}) => {
    if (!ref || !ref.current) return null; // Ensure ref is valid
    const { x, y } = ref.current.position

    let closestApple = null;
    for (const apple of apples) {
        if (!apple.ref || !apple.ref.current) continue; // Ensure apple has a valid ref
        const pos = apple.ref.current.position
        const distance = Math.sqrt((pos.x - x + refOffset.x) ** 2 + (pos.y - y + refOffset.y) ** 2);

        const appleObject = {
            distance,
            ...apple,
            ref: apple.ref,
        }

        if (!closestApple) closestApple = appleObject;
        else if (appleObject.distance < closestApple.distance) {
            closestApple = appleObject;
        }

    }
    return closestApple;
}

