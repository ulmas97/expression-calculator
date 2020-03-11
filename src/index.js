const calc = (str) => {
    let v1 = str.match(/-?\d+\.?\d*/); // first num
    let v2 = str.match(/(?<=\d[-+/*])-?\d+.?\d*/); // second num
    let operator = str.match(/(?<=\d)[-+*/]/);

    switch (String(operator)) {
        case '+':
            return +v1 + +v2;
        case '-':
            return v1 - v2;
        case '*':
            return v1 * v2;
        case '/':
            if (v2 == 0) {
                throw new Error('TypeError: Division by zero.');
            }
            return ((v1 / v2).toFixed(14) == (v1 / v2)) ? (v1 / v2) : (v1 / v2).toFixed(14);
    }
};

const isPaired = (str) => {
    let count = 0;
    let every = str.split('').every((curr) => {
        if (count < 0) {
            return false;
        }
        if (curr === '(') {
            count++;
        }
        if (curr === ')') {
            count--;
        }
        return true;
    });
    return (count === 0) && every;
};

function expressionCalculator(expr) {
    if (!isPaired(expr)) {
        throw new Error('ExpressionError: Brackets must be paired');
    }
    let ex = expr.replace(/\s/g, ''); // trim expression
    const simplePart = /-?\d*[,.]??\d+[+-]-?\d*[,.]??\d+/; // +,- operations
    const prioryPart = /(?<=-|^)-?\d*\.?\d+[*/]-?\d*\.?\d+|\d*\.?\d+[*/]-?\d*\.?\d+/; // /,* -operations

    while (/\(.*\)/.test(ex)) { // while brackets in expression
        let partInBrackets = expressionCalculator(String(ex.match(/(?<=\()[\.0-9-+/*]*(?=\))/)));
        ex = ex.replace(ex.match(/\([\.0-9-+/*]*\)/), partInBrackets);
    }

    while (ex.match(/\b\d*[,.]??\d+\b/g).length > 2) { // 2 or more numbers
        let reg = simplePart; // +,- operations
        if (prioryPart.test(ex)) { // if *,/ do it first
            reg = prioryPart;
        }
        let chain = calc(String(ex.match(reg)));
        ex = ex.replace(reg, chain);
    }
    return calc(ex);
}

module.exports = {
    expressionCalculator
}