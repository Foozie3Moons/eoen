d3.select("div#chart")
    .insert("div",":first-child")
    .classed("svg-container", true) //container class to make it responsive
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 900 300")
    //class to make it responsive
      .classed("svg-content-responsive", true);

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = parseInt(d3.select('.svg-content-responsive').style('width')) - margin.left - margin.right,
    height = parseInt(d3.select('.svg-content-responsive').style('height')) - margin.top - margin.bottom;

var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#3B76AB", "#FF4B4B", "#3DCF3D", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
//
// d3.csv("../csv/data.csv", function(d, i, columns) {
//   for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
//   d.total = t;
//   return d;
// }, function(error, data) {
//   console.log(data);
//   if (error) throw error;
//
//   var keys = data.columns.slice(1);
//   console.log(keys);
//   data.sort(function(a, b) { return b.total - a.total; });
//   x.domain(data.map(function(d) { return d.State; }));
//   y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
//   z.domain(keys);
//
//   g.append("g")
//     .selectAll("g")
//     .data(d3.stack().keys(keys)(data))
//     .enter().append("g")
//       .attr("fill", function(d) { return z(d.key); })
//     .selectAll("rect")
//     .data(function(d) { return d; })
//     .enter().append("rect")
//       .attr("x", function(d) { return x(d.data.State); })
//       .attr("y", function(d) { return y(d[1]); })
//       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
//       .attr("width", x.bandwidth());
//
//   g.append("g")
//       .attr("class", "axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));
//
//   g.append("g")
//       .attr("class", "axis")
//       .call(d3.axisLeft(y).ticks(null, "s"))
//     .append("text")
//       .attr("x", 2)
//       .attr("y", y(y.ticks().pop()) + 0.5)
//       .attr("dy", "0.32em")
//       .attr("fill", "#000")
//       .attr("font-weight", "bold")
//       .attr("text-anchor", "start")
//       .text("Population");
//
//   var legend = g.append("g")
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 10)
//       .attr("text-anchor", "end")
//     .selectAll("g")
//     .data(keys.slice().reverse())
//     .enter().append("g")
//       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
//   legend.append("rect")
//       .attr("x", width - 19)
//       .attr("width", 19)
//       .attr("height", 19)
//       .attr("fill", z);
//
//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9.5)
//       .attr("dy", "0.32em")
//       .text(function(d) { return d; });
// });

function renderStacked(data) {

  var keys = ['balance', 'interest', 'principle'];

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr('width', width);

  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.balance; })]).nice();
  z.domain(keys);

  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.year); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .exit().remove();

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");


  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

  legend.exit().remove();
}

var data = [];
$('.submit').on('click', function() {
  data = [];
  var submitted = {};
  $('form#loan').serializeArray().map(function(x){submitted[x.name] = x.value;});
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
      mapr            = apr / 100 / 12,
      monthlyPayment  = getPayment(mapr, n, loanAmount),
      paymentNumber   = 1,
      year            = 1,
      yearlyInterest  = 0,
      yearlyPrinciple = 0;
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
  console.log(data);

  renderStacked(data);
});

console.log(data);
$('input[type=radio][name=view]').change(function() {
  if (this.value === 'grouped') {
    console.log(data);
    renderGrouped(data);
  } else if (this.value === 'stacked') {
    renderStacked(data);
  }
})
