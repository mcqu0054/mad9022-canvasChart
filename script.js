var values = [];
var labels = [];
var colors = [];


var total = 0;
var largest = 0;
var smallest = 100;

for (var i = 0; i < cheese.segments.length; i++) {
    values.push(cheese.segments[i].value);
    labels.push(cheese.segments[i].label);
    colors.push(cheese.segments[i].color);
    
    if(cheese.segments[i].value > largest){
        largest = cheese.segments[i].value;
    }
     if(cheese.segments[i].value < smallest){
        smallest = cheese.segments[i].value;
    }
}
var canvas, context;


for (var i = 0; i < values.length; i++) {
    total += values[i];
}

document.addEventListener("DOMContentLoaded", function () {
    //set global vars for canvas and context
    canvas = document.querySelector("#graph");
    context = canvas.getContext("2d");


    function showPie() {
        //clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        //set the styles in case others have been set
        //setDefaultStyles();
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        var radius = 100;
        var currentAngle = 0;
        //the difference for each wedge in the pie is arc along the circumference
        //we use the percentage to determine what percentage of the whole circle
        //the full circle is 2 * Math.PI radians long.
        //start at zero and travelling clockwise around the circle
        //start the center for each pie wedge
        //then draw a straight line out along the radius at the correct angle
        //then draw an arc from the current point along the circumference
        //stopping at the end of the percentage of the circumference
        //finally going back to the center point.
        for (var i = 0; i < values.length; i++) {
            var pct = values[i] / total;
            
            if(cheese.segments[i].value == largest){
                radius = 90;
            } else if (cheese.segments[i].value == smallest) {
                radius = 110;
            } else {
                radius = 100;
            }
            console.log(cheese.segments[i].value);
            //create colour 0 - 16777216 (2 ^ 24) based on the percentage
            var intColour = parseInt(pct * 16777216);
            //console.log(intColour);
            var red = ((intColour >> 16) & 255);
            var green = ((intColour >> 8) & 255);
            var blue = (intColour & 255);
            //console.log(red, green, blue);
            var colour = colors[i];
            //console.log(colour);
            var endAngle = currentAngle + (pct * (Math.PI * 2));
            //draw the arc
            context.moveTo(cx, cy);
            context.beginPath();
            context.fillStyle = colour;
            context.arc(cx, cy, radius, currentAngle, endAngle, false);
            context.lineTo(cx, cy);
            context.fill();


            //Now draw the lines that will point to the values
            context.save();
            context.translate(cx, cy); //make the middle of the circle the (0,0) point
            context.strokeStyle = "#0CF";
            context.lineWidth = 1;
            context.beginPath();
            //angle to be used for the lines
            var midAngle = (currentAngle + endAngle) / 2; //middle of two angles
            context.moveTo(0, 0); //this value is to start at the middle of the circle
            //to start further out...
            var dx = Math.cos(midAngle) * (0.8 * radius);
            var dy = Math.sin(midAngle) * (0.8 * radius);
            context.moveTo(dx, dy);
            //ending points for the lines
            var dx = Math.cos(midAngle) * (radius + 30); //30px beyond radius
            var dy = Math.sin(midAngle) * (radius + 30);
            context.lineTo(dx, dy);
            context.stroke();
            //put the canvas back to the original position
            context.fillText(cheese.segments[i].label,dx,dy);
            context.restore();
            //update the currentAngle
            currentAngle = endAngle;
        }
    };

    showPie();


    function showCircles() {
        //clear the canvas

        context.clearRect(0, 0, canvas.width, canvas.height);
        //set the styles in case others have been set
        //setDefaultStyles();
        var numPoints = values.length; //number of circles to draw.
        var padding = 12; //space away from left edge of canvas to start drawing.
        var magnifier = 12.2;
        var horizontalAxis = canvas.height / 2; //how far apart to make each x value.
        //use the percentage to calculate the height of the next point on the line
        //start at values[1].
        //values[0] is the moveTo point.
        var currentPoint = 0; //this will become the center of each cirlce.
        var x = 0;
        var y = horizontalAxis; //center y point for circle
        var colour = "#00FF00";
        for (var i = 0; i < values.length; i++) {
            //the percentages will be used to create the area of the circles
            //using the radius creates way too big a range in the size
            var pct = Math.round((values[i] / total) * 100);
            // the fill colour will be a shade of yellow
            // For shades of yellow the Reds should be E0 - FF, 
            // Greens should be less C0 - D0
            // blues are based on the percentage
            var a = (0xD0 + Math.round(Math.random() * 0x2F));
            var b = (0xD0 + Math.round(Math.random() * 0x2F));
            var red = Math.max(a, b).toString(16);
            var green = Math.min(a, b).toString(16);
            var blue = (Math.floor(pct * 2.55)).toString(16);
            if (red.length == 1) red = "0" + red;
            if (green.length == 1) green = "0" + green;
            if (blue.length == 1) blue = "0" + blue;
            colour = "#" + red + green + blue;
            // area = Math.PI * radius * radius
            // radius = Math.sqrt( area / Math.PI );
            var radius = Math.sqrt(pct / Math.PI) * magnifier;
            // magnifier makes all circles bigger
            x = currentPoint + padding + radius;
            //center x point for circle
            //draw the circle
            context.beginPath();
            context.fillStyle = colour;
            //colour inside the circle set AFTER beginPath() BEFORE fill()
            context.strokeStyle = "#333"; //colour of the lines 
            context.lineWidth = 3;
            context.arc(x, y, radius, 0, Math.PI * 2, false);
            context.closePath();
            context.fill(); //fill comes before stroke
            context.stroke();
            //to add labels take the same x position but go up or down 30 away from the y value
            //use the percentage to decide whether to go up or down. 20% or higher write below the line		
            var lbl = pct.toString();
            context.font = "normal 10pt Arial";
            context.textAlign = "center";
            context.fillStyle = "#000000"; //colour inside the circle
            context.beginPath();
            context.fillText(lbl, x, y + 6);
            context.closePath();
            currentPoint = x + radius;
            //move the x value to the end of the circle for the next point  
        }

    };

    canvas = document.querySelector("#graph2");
    context = canvas.getContext("2d");
    showCircles();

});