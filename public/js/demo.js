var margin = { left: 30, top: 30, right: 30, bottom: 30 };
var barPadding = 0.2;

var xColumn = "year";
var yColumn = "amount";
var colorColumn = "paymentType";
var layerColumn = colorColumn;


var svg = d3.select('body').select('svg');

var innerWidth  = svg.style('width').replace("px", "")  - margin.left - margin.right;
var innerHeight = svg.style('height').replace("px", "") - margin.top  - margin.bottom;

var xAxisLabelText = "Time";
var xAxisLabelOffset = 48;

var yAxisLabelText = "Population";
var yAxisLabelOffset = 10;

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

function renderGrouped(data){

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

function renderStacked(data) {

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
        return d.y0 + d.y;
      });
    })
  ]);

  colorScale.domain(layers.map(function (layer){
    return layer.key;
  }));

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);

  var layerGroups = g.selectAll(".layer").data(layers);
  layerGroups.enter().append("g").attr("class", "layer");
  layerGroups.exit().remove();
  layerGroups.style("fill", function (d){
    return colorScale(d.key);
  });

  var bars = layerGroups.selectAll("rect").data(function (d){
    return d.values;
  });
  bars.enter().append("rect")
  bars.exit().remove();
  bars
    .attr("x", function (d){ return xScale(d[xColumn]); })
    .attr("y", function (d){ return yScale(d.y0 + d.y); })
    .attr("width", xScale.rangeBand())
    .attr("height", function (d){ return innerHeight - yScale(d.y); })
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
  var lifeOfLoan = submitted.lifeOfLoan,
      n = lifeOfLoan * 12,
      downPayment = submitted.downPayment,
      loanAmount = submitted.loanAmount - downPayment,
      apr = submitted.apr,
      mapr = apr / 100 / 12,
      monthlyPayment = getPayment(mapr, n, loanAmount),
      paymentNumber = 1,
      year = 1,
      yearlyInterest = 0,
      yearlyPrinciple = 0;
  console.log("paymentNumber: ",
              paymentNumber,
              "year: ",
              year,
              ", loanAmount: ",
              loanAmount,
              ", monthlyPayment: ",
              monthlyPayment,
              ", APR: ",
              apr,
              ", MAPR: ",
              mapr);

  var yearlyInterest = 0;
  var yearlyPrinciple = 0;
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
      console.log("paymentNumber: ",
                  paymentNumber,
                  "year: ",
                  year,
                  ", loanAmount: ",
                  loanAmount,
                  ", monthlyPayment: ",
                  monthlyPayment,
                  ", APR: ",
                  apr,
                  ", MAPR: ",
                  mapr);
      data.push({
        year: year,
        paymentType: 'interest',
        amount: yearlyInterest
      },
      {
        year: year,
        paymentType: 'principle',
        amount: yearlyPrinciple
      });
      year += 1;
      yearlyInterest = 0;
      yearlyPrinciple = 0;
    }
  }
  renderGrouped(data);
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
