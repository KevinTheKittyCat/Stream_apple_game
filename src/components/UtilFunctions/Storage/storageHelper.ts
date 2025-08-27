


const setStorageItem = (storageId, item) => {
    localStorage.setItem(storageId, JSON.stringify(item));
};

/**
 * 
 * @param storageId 
 * @param talents an array of objects with a ref. 
 * Example: 
 * setItemRemoveRefStringify("talents", [{ ref: 1, name: "Talent 1" }, { ref: 2, name: "Talent 2" }]);
 */
export const setItemRemoveRefStringify = (storageId, talents) => {
    localStorage.setItem(storageId, JSON.stringify(talents.map(({ ref, ...rest }) => rest)));
};

export const getStorageItem = (storageId) => {
    const talents = JSON.parse(localStorage.getItem(storageId)) || undefined;
    return talents;
};
