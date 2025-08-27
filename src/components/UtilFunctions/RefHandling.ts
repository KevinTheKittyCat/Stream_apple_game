





export const handleIfRef = (item: any) => {
    if (item?.current) {
        const newCurrent = item.current;
        return newCurrent;
    }
    return item;
}

export const handlePositionIfRef = (item: any) => {
    const resolvedItem = handleIfRef(item);
    return  Object.assign({}, { x: resolvedItem.x, y: resolvedItem.y });
}
