





export const handleIfRef = (item: React.RefObject<any> | any) => {
    if (item?.current) {
        const newCurrent = item.current;
        return newCurrent;
    }
    return item;
}

export const handlePositionIfRef = (item: React.RefObject<any> | any) => {
    const resolvedItem = handleIfRef(item);
    return  Object.assign({}, { x: resolvedItem.x, y: resolvedItem.y });
}

export const checkIfRefExists = (item: React.RefObject<any> | null) => {
    return item?.current !== undefined;
}

export const checkRefValueExists = (item: React.RefObject<any> | null, key: string) => {
    return item?.current?.[key] !== undefined;
}
