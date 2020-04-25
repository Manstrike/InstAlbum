export class ArraySplitter {
    static split(array, numberOfColumns = 1) {
        const columns = Array.from(new Array(4), () => []);

        for (let i = 0; i < array.length; i += numberOfColumns) {
            const temp  = array.slice(i, i + numberOfColumns);
        
            for (let j = 0; j < temp.length; j++) {
              columns[j].push(temp[j]);
            }
        }

        return columns;
    }
}