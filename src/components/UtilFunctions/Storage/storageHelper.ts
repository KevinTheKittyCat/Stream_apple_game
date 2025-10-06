



export const setStorageItem = (storageId: string, item: any) => {
    localStorage.setItem(storageId, JSON.stringify(item));
};


/**
 * 
 * @param storageId 
 * @param talents an array of objects with a ref. 
 * Example: 
 * setItemRemoveRefStringify("talents", [{ ref: 1, name: "Talent 1" }, { ref: 2, name: "Talent 2" }]);
 */
export const setItemRemoveRefStringify = (storageId: string, talents: Array<{ ref: number, name: string }>) => {
    localStorage.setItem(storageId, JSON.stringify(talents.map(({ ref, ...rest }) => rest)));
};


export const getStorageItem = (storageId: string) => {
    if (!localStorage.getItem(storageId)) return undefined;
    const item = localStorage.getItem(storageId) as string;
    const talents = JSON.parse(item);
    return talents;
};
