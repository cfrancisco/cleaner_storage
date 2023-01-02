/**
 * Utility array to storage some object with embedded sorting.
 * 
 */

export type ArrayObjectType = {
    key: string, 
    value: any, 
    expirationDate: number, 
}
 

export const ArrayWithSortedObject = () => {
    const _list:any[] = [];


    const nextCurrent = () => {
        sort();
    };

    const resetCurrent = () => {
        sort();
    };


    const sort = () => {
        _list.sort((a, b) => {
            return a.expirationDate - b.expirationDate;
        });
    };

    const removeFirstItem = () => {
        _list.shift();
    }


    const getLength = () => {
        return _list.length;
    }

    const push = (obj:any) => {
        _list.push(obj);
        sort();
    };

    const top = () => {
        if (_list.length === 0) {
            console.debug("No data in current list");
            return undefined;
        }
        return _list[0];
    }

    return {
        nextCurrent,
        resetCurrent,
        push,
        top,
        removeFirstItem,
        sort,
        getLength
    }
};
