var margin = { left: 30, top: 30, right: 30, bottom: 30 };
var barPadding = 0.2;

var xColumn = "year";
var yColumn = "amount";
var colorColumn = "paymentType";
var layerColumn = colorColumn;


var svg = d3.select('body').select('svg');

var innerWidth  = svg.style('width').replace("px", "")  - margin.left - margin.right;
var innerHeight = svg.style('height').replace("px", "") - margin.top  - margin.bottom;

var g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var xAxisG = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + innerHeight + ")");
var yAxisG = g.append("g")
  .attr("class", "y axis");
var colorLegendG = g.append("g")
  .attr("class", "color-legend")
  .attr("transform", "translate(235, 0)");

var xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
var yScale = d3.scale.linear().range([innerHeight, 0]);
var colorScale = d3.scale.category10();

var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
  .outerTickSize(0);
var yAxis = d3.svg.axis().scale(yScale).orient("left")
  .ticks(5)
  .tickFormat(d3.format("s"))
  .outerTickSize(0);

var colorLegend = d3.legend.color()
  .scale(colorScale)
  .shapePadding(2)
  .shapeWidth(15)
  .shapeHeight(15)
  .labelOffset(4);

function render(data){

  var nested = d3.nest()
    .key(function (d){ return d[layerColumn]; })
    .entries(data)

  var stack = d3.layout.stack()
    .y(function (d){ return d[yColumn]; })
    .values(function (d){ return d.values; });

  var layers = stack(nested);

  xScale.domain(layers[0].values.map(function (d){
    return d[xColumn];
  }));

  yScale.domain([
    0,
    d3.max(layers, function (layer){
      return d3.max(layer.values, function (d){
        return d.y;
      });
    })
  ]);

  colorScale.domain(layers.map(function (layer){
    return layer.key;
  }));

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);

  var layers = g.selectAll(".layer").data(layers);
  layers.enter().append("g").attr("class", "layer");
  layers.exit().remove();
  layers.style("fill", function (d){
    return colorScale(d.key);
  });

  var bars = layers.selectAll("rect").data(function (d){
    return d.values;
  });
  var barWidth = xScale.rangeBand() / colorScale.domain().length;
  bars.enter().append("rect")
  bars.exit().remove();
  bars
    .attr("x", function (d, i, j){
      return xScale(d[xColumn]) + barWidth * j;
    })
    .attr("y", function (d){ return yScale(d.y); })
    .attr("width", barWidth)
    .attr("height", function (d){ return innerHeight - yScale(d.y); })

  colorLegendG.call(colorLegend);
}

$('.submit').on('click', function() {
  var data = [];
  var submitted = {};
  $('form#loan').serializeArray().map(function(x){submitted[x.name] = x.value;});
  var getPayment = function(rate, n, loanAmount) {
    return (rate / (1 - Math.pow((1 + rate), -n)) * loanAmount)
  }
  var n = submitted.lifeOfLoan * 12;
  // console.log(n);
  var loanAmount = parseInt(submitted.loanAmount * 100 - submitted.downPayment * 100);
  // console.log(loanAmount);
  var rate = submitted.interestRate / 12;
  // console.log(rate);
  var monthlyPayment = parseInt(getPayment(rate, n, loanAmount));
  // console.log(monthlyPayment);
  var paymentSchedule = [];
  var paymentNumber = 1;
  var year = 0;
  while (loanAmount > 0) {
    var interest = loanAmount * rate;
    var principle = monthlyPayment - interest;
    if (data.filter(function(e) {e.year === year}).length > 0) {
      data.push({
        year: year,
        paymentType: 'interest',
        amount: interest
      }, {
        year: year,
        paymentType: 'principle',
        amount: principle
      });
    } else {
      yearlyInterest = data.filter(function(e) {e.year === year && paymentType === 'interest'});
      yearlyPrinciple = data.filter(function(e) {e.year === year && paymentType === 'principle'});
      yearlyInterest.amount += interest;
      yearlyPrinciple.amount += principle;
    }
    console.log(loanAmount);
    loanAmount -= monthlyPayment;
    if (paymentNumber % 12 === 0) {
      year += 1;
    }
    paymentNumber += 1;
  }
  render(data);
});
