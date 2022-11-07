const sortDataByKey = (fields) => (a, b) =>
    fields
        .map((o) => {
            let dir = 1;
            if (o[0] === '-') {
                dir = -1;
                o = o.substring(1);
            }
            return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
        })
        .reduce((p, n) => (p ? p : n), 0);

export default sortDataByKey;

// const sortedArray = Array.sort(sortDataByKey(['size', '-price', 'id']));
