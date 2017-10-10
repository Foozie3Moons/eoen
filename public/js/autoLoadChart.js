function toCurrency(float) {
  return parseFloat(parseFloat(Math.round(float * 100) / 100).toFixed(2));
}
function getPayment(rate, n, loanAmount) {
  return toCurrency(rate / (1 - Math.pow((1 + rate), -n)) * loanAmount);
}
var lifeOfLoan      = loan.lifeOfLoan,
    n               = lifeOfLoan * 12,
    downPayment     = loan.downPayment || 0,
    loanAmount      = loan.loanAmount - downPayment,
    apr             = loan.apr,
    paymentsPerYear = loan.paymentsPerYear,
    mapr            = apr / 100 / paymentsPerYear,
    monthlyPayment  = getPayment(mapr, n, loanAmount),
    paymentNumber   = 1,
    year            = 1,
    yearlyInterest  = 0,
    yearlyPrinciple = 0;
    totalInterest = 0;
    totalPrinciple = 0;

while (paymentNumber < n) {
  loanAmount = toCurrency(loanAmount);
  var monthlyInterest = loanAmount * mapr;
  monthlyInterest = toCurrency(monthlyInterest);
  var monthlyPrinciple = monthlyPayment - monthlyInterest;
  yearlyInterest += monthlyInterest;
  yearlyPrinciple += monthlyPrinciple;
  paymentNumber += 1;
  loanAmount += monthlyInterest;
  loanAmount -= monthlyPayment;
  totalPrinciple += monthlyPrinciple;
  totalInterest += monthlyInterest;
  if (paymentNumber % 12 === 1) {
    data.push({
      year: year,
      balance: loanAmount,
      interest: yearlyInterest,
      principle: yearlyPrinciple
    });
    year += 1;
    yearlyInterest = 0;
    yearlyPrinciple = 0;
  }
}

$('.totalInterest').text(totalInterest);
$('.totalPrinciple').text(totalPrinciple);
$('.totalPaid').text(totalPrinciple + totalInterest);

renderStacked(data);
