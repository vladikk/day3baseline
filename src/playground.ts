import { CabinLayout, Row } from './model/cabin-layout';

let l = new CabinLayout('1', 10, 200, [
    new Row('BIZ-ULTRA', [2,2], 10),
    new Row('BIZ-ULTRA', [2,2], 10),
    new Row('BIZ-ULTRA', [2,2], 0),
    new Row('BIZ-ULTRA', [2,2], 0),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [2,2], 10),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0),
    new Row('ECON-CLSC', [3,3], 0)
], 1);

console.log(JSON.stringify(l, null, 0));