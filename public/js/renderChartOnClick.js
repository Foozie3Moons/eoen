var data = [];
$('.submit').on('click', function() {
  data = [];
  var submitted = {};
  $('form#loan')
    .serializeArray()
    .map(function(x){submitted[x.name] = x.value;});
  var form = $('form#createLoan').children();

  function toCents(currency) {
    return Math.floor(currency * 100)
  }
  function toDollars(currency) {
    return Math.floor(currency / 100)
  }
  function getPayment(rate, n, loanAmount) {
    return toCents(rate / (1 - Math.pow((1 + rate), -n)) * loanAmount);
  }
  var lifeOfLoan      = submitted.lifeOfLoan,
      totalPayments   = lifeOfLoan * 12,
      downPayment     = toCents(submitted.downPayment) || 0,
      loanAmount      = toCents(submitted.loanAmount) - downPayment,
      apr             = submitted.apr,
      paymentsPerYear = submitted.paymentsPerYear || 12,
      mapr            = apr / 100 / paymentsPerYear,
      monthlyPayment  = getPayment(mapr, n, loanAmount),
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

  for (var paymentNumber = 1; paymentNumber < totalPayments; paymentNumber++) {
    var monthlyInterest = Math.floor(loanAmount * mapr);
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
      yearlyInterest = 0;
      yearlyPrinciple = 0;
    }
  }

  renderStacked(data);
});
