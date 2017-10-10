var data = [];
$('.submit').on('click', function() {
  data = [];
  var submitted = {};
  $('form#loan')
    .serializeArray()
    .map(function(x){submitted[x.name] = x.value;});
  var form = $('form#createLoan').children();

  function toCurrency(float) {
    return parseFloat(parseFloat(Math.round(float * 100) / 100).toFixed(2));
  }
  function getPayment(rate, n, loanAmount) {
    return toCurrency(rate / (1 - Math.pow((1 + rate), -n)) * loanAmount);
  }
  var lifeOfLoan      = submitted.lifeOfLoan,
      n               = lifeOfLoan * 12,
      downPayment     = submitted.downPayment || 0,
      loanAmount      = submitted.loanAmount - downPayment,
      apr             = submitted.apr,
      paymentsPerYear = submitted.paymentsPerYear || 12,
      mapr            = apr / 100 / paymentsPerYear,
      monthlyPayment  = getPayment(mapr, n, loanAmount),
      paymentNumber   = 1,
      year            = 1,
      yearlyInterest  = 0,
      yearlyPrinciple = 0;

  for (let i = 0; i < form.length; i++) {
    var id = $(form[i]).children('input').attr('id');
    switch (id) {
      case 'lifeOfLoan':
        $(form[i]).children('input').attr('value', lifeOfLoan);
        break;
      case 'loanAmount':
        $(form[i]).children('input').attr('value', loanAmount);
        break;
      case 'apr':
        $(form[i]).children('input').attr('value', apr);
        break;
      case 'paymentsPerYear':
        $(form[i]).children('input').attr('value', paymentsPerYear);
        break;
      case 'downPayment':
        $(form[i]).children('input').attr('value', downPayment);
        break;
    }
  }

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

  renderStacked(data);
});
