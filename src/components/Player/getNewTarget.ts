export const findClosestReachableApple = (apples, ref) => {
    const { x, y } = ref.current.position

    let closestApple = null;
    for (const apple of apples) {
        if (!apple.ref || !apple.ref.current) continue; // Ensure apple has a valid ref
        const pos = apple.ref.current.position
        const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2);

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

