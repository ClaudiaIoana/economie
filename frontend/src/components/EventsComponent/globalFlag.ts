let globalFlag = false;

export const getGlobalFlag = (): boolean => globalFlag;

export const setGlobalFlag = (value: boolean): void => {
    globalFlag = value;
};

export const toggleGlobalFlag = (): void => {
    globalFlag = !globalFlag;
};