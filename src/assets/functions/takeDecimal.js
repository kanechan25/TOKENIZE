const takeDecimal = (num, n) => {
    let base = 10 ** n;
    let result = Math.round(num * base) / base;
    return result;
};

export default takeDecimal;

// num = 124.468454325132 =>  console.log(takeDecimal(num, 3)); //124.468
