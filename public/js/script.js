var getMonthlyPayment = function(rate, n, loanAmount) {
  return (rate / (1 - Math.pow((1 + rate), -n)) * loanAmount)
}

var monthlyPayment = getMonthlyPayment(0.045 / 12, 360, 478350);

console.log(monthlyPayment);
