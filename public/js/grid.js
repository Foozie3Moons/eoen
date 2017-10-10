// var tileW = 250,
// 	tileH = 150,
// 	bgElement = d3.selectAll( '.tiles' ),
// 	randButton = d3.select( '#randomise' ),
// 	canvas = d3.select( document.createElement( 'canvas' ) )
// 		.attr( 'width', tileW )
// 		.attr( 'height', tileH ),
// 	ctx = canvas.node().getContext( '2d' ),
// 	color = d3.scaleOrdinal( d3.schemeCategory20 ),
// 	voronoi = d3.voronoi()
// 		.x( function(d) { return d.x; } )
//     	.y( function(d) { return d.y; } )
// 		.extent( [[-5, -5], [tileW + 5, tileH + 5]] );
//
// randButton.on( 'click', updateBg );
//
// updateBg();
//
// function updateBg() {
//
// 	var tiles = d3.range( Math.floor( Math.random() * 8 ) + 2 )
// 		.map( function(d) { return {
// 			x: Math.random() * tileW,
// 			y: Math.random() * tileH
// 		} }),
// 		diagram = voronoi( tiles ),
// 		polygons = diagram.polygons();
//
// 	ctx.clearRect( 0, 0, tileW, tileH );
//
// 	ctx.strokeStyle = "#fff";
// 	ctx.lineWidth = 5;
//
// 	for ( var i = 0, n = polygons.length; i < n; ++i ) {
// 		drawCell( polygons[i] );
// 		ctx.fillStyle = color(i);
// 		ctx.fill();
// 		//ctx.stroke();
// 	}
//
// 	var dataURL = canvas.node().toDataURL();
// 	bgElement.style( 'background-image', 'url(' + dataURL + ')' );
//
// }
//
// function drawCell( cell ) {
//
// 	if ( !cell ) return false;
// 	ctx.beginPath();
// 	ctx.moveTo( cell[0][0], cell[0][1] );
// 	for ( var j = 1, m = cell.length; j < m; ++j ) {
// 		ctx.lineTo( cell[j][0], cell[j][1] );
// 	}
// 	ctx.closePath();
// 	return true;
//
//
var svg = d3.select("#hex"),
    svgContent = document.getElementsByClassName('svg-container')[0],
    margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = +svgContent.offsetWidth - margin.left - margin.right,
    height = +svgContent.offsetHeight - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var randomX = d3.randomNormal(width / 2, 80),
    randomY = d3.randomNormal(height / 2, 80),
    points = d3.range(2000).map(function() { return [randomX(), randomY()]; });

var color = d3.scaleSequential(d3.interpolateLab("white", "steelblue"))
    .domain([0, 20]);

var hexbin = d3.hexbin()
    .radius(20)
    .extent([[0, 0], [width, height]]);

var x = d3.scaleLinear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, height])
    .range([height, 0]);

g.append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

g.append("g")
    .attr("class", "hexagon")
    .attr("clip-path", "url(#clip)")
  .selectAll("path")
  .data(hexbin(points))
  .enter().append("path")
    .attr("d", hexbin.hexagon())
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .attr("fill", function(d) { return color(d.length); });

// // Below are the functions that handle actual exporting:
// // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
// function getSVGString( svgNode ) {
// 	svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
// 	var cssStyleText = getCSSStyles( svgNode );
// 	appendCSS( cssStyleText, svgNode );
//
// 	var serializer = new XMLSerializer();
// 	var svgString = serializer.serializeToString(svgNode);
// 	svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
// 	svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix
//
// 	return svgString;
//
// 	function getCSSStyles( parentElement ) {
// 		var selectorTextArr = [];
//
// 		// Add Parent element Id and Classes to the list
// 		selectorTextArr.push( '#'+parentElement.id );
// 		for (var c = 0; c < parentElement.classList.length; c++)
// 				if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
// 					selectorTextArr.push( '.'+parentElement.classList[c] );
//
// 		// Add Children element Ids and Classes to the list
// 		var nodes = parentElement.getElementsByTagName("*");
// 		for (var i = 0; i < nodes.length; i++) {
// 			var id = nodes[i].id;
// 			if ( !contains('#'+id, selectorTextArr) )
// 				selectorTextArr.push( '#'+id );
//
// 			var classes = nodes[i].classList;
// 			for (var c = 0; c < classes.length; c++)
// 				if ( !contains('.'+classes[c], selectorTextArr) )
// 					selectorTextArr.push( '.'+classes[c] );
// 		}
//
// 		// Extract CSS Rules
// 		var extractedCSSText = "";
// 		for (var i = 0; i < document.styleSheets.length; i++) {
// 			var s = document.styleSheets[i];
//
// 			try {
// 			    if(!s.cssRules) continue;
// 			} catch( e ) {
// 		    		if(e.name !== 'SecurityError') throw e; // for Firefox
// 		    		continue;
// 		    	}
//
// 			var cssRules = s.cssRules;
// 			for (var r = 0; r < cssRules.length; r++) {
// 				if ( contains( cssRules[r].selectorText, selectorTextArr ) )
// 					extractedCSSText += cssRules[r].cssText;
// 			}
// 		}
//
//
// 		return extractedCSSText;
//
// 		function contains(str,arr) {
// 			return arr.indexOf( str ) === -1 ? false : true;
// 		}
//
// 	}
//
// 	function appendCSS( cssText, element ) {
// 		var styleElement = document.createElement("style");
// 		styleElement.setAttribute("type","text/css");
// 		styleElement.innerHTML = cssText;
// 		var refNode = element.hasChildNodes() ? element.children[0] : null;
// 		element.insertBefore( styleElement, refNode );
// 	}
// }
//
//
// function svgString2Image( svgString, width, height, format, callback ) {
// 	var format = format ? format : 'png';
//
// 	var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
//
// 	var canvas = document.createElement("canvas");
// 	var context = canvas.getContext("2d");
//
// 	canvas.width = width;
// 	canvas.height = height;
//
// 	var image = new Image();
// 	image.onload = function() {
// 		context.clearRect ( 0, 0, width, height );
// 		context.drawImage(image, 0, 0, width, height);
//
// 		canvas.toBlob( function(blob) {
// 			var filesize = Math.round( blob.length/1024 ) + ' KB';
// 			if ( callback ) callback( blob, filesize );
// 		});
//
//
// 	};
//
// 	image.src = imgsrc;
// }
