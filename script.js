function initializeArray(length, value) {
    var array = [];
    var i;
    if (typeof(value) === "function") {
        for(i = 0; i < length; i++) {
            array.push(value(i));
        }
    }
    else {
        for(i = 0; i < length; i++) {
            array.push(value);
        }
    }
    return array;
}

var keyPressCount = 0;

var historySize = 100;
var stepSize = 1000; // milliseconds

var timeOfLastMeasurement = null;
var accumulator = 0;

var keyPressData = initializeArray(historySize, 0);

// console.log('keyPressData', keyPressData);

var height = 400,
    width = 600,
    barWidth = 10,
    barOffset = 1;

// configure the 'keyup' event listener
d3.select('body').on('keyup', function () {
    keyPressCount++;
});

var yScale = d3.scale.linear()
    .domain([0, 20])
    .range([0, height * 0.95]);


var xScale = d3.scale.ordinal()
        .domain(d3.range(0, keyPressData.length))
        .rangeBands([0, width])

function step() {
    keyPressData.shift();
    keyPressData.push(keyPressCount);
    keyPressCount = 0;
}

function draw() {
    d3.select('#chart').html("");

    d3.select('#chart').append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#C9D7D6')
        .selectAll('rect').data(keyPressData)
        .enter().append('rect')
            .style('fill', '#C61C6F')
            .attr('width', xScale.rangeBand())
            .attr('height', function(d) {
                return yScale(d);
            })
            .attr('x', function(d,i) {
                return xScale(i);
            })
            .attr('y', function(d) {
                return height - yScale(d);
            });
}

function tick(timestamp) {

    if (!timeOfLastMeasurement) {
        timeOfLastMeasurement = timestamp
    }

    var timeDelta = timestamp - timeOfLastMeasurement;
    timeOfLastMeasurement = timestamp;
    accumulator += timeDelta;

    while (accumulator >= stepSize) {
        step();
        accumulator -= stepSize;
    }

    // console.log('keyPressData', keyPressData);

    draw();

    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);