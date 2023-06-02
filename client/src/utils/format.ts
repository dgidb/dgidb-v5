export const truncateDecimals = (numb: number, digits: number) => {
  var multiplier = Math.pow(10, digits),
    adjustedNum = numb * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

  return truncatedNum / multiplier;
};
