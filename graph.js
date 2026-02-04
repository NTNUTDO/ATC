// Timeline: width 75*60=4500/6=750 eli skaalaa kaikki kuudella tai ainakin len

var timelineColors = ["#296FB7", "#E1A92E", "#CF4134"];

function clearTimeline() {
    if (document.getElementById("canvas") == null) { return; }
    node = document.getElementById("divTimeline");
    removed = document.getElementById("canvas");
    node.removeChild(removed);
}

function leading0(tmp) {
    if (tmp < 10) { return "0" + parseInt(tmp); }
    else { return parseInt(tmp); }
}

function sec2time(tmp) {
    var mins = Math.floor(tmp / 60);
    var secs = tmp - 60 * mins;
    return leading0(mins) + ":" + leading0(secs);
}

/*
*   input: ticks, start time
*   output: time formate: string hh:mm
*/
function ticksToTimeString(tick) {
    var time = new Date(startTime + tick * 1000);
    var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    var m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var s = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    return h + ":" + m + ":" + s;
}

function createTimeline() {
    if (masterRunning) {
        if (!confirm('Are you sure? Stop timer and create timeline.')) return;

        ticker.stop();
        $("#bM").addClass("btn-primary");
        $("#bM").removeClass("btn-warning");
        document.getElementById("bM").innerHTML = "Finished";
        $("#bM").addClass("disabled");
        $("#sendRecord").addClass("disabled");
        $("#startRecord").addClass("disabled");
        document.getElementById("recordText").disabled = true;
        $("#inserTime").addClass("disabled");
        masterRunning = false;
    }
    else if (ticks == 0) { alert('There is no data.'); return; }
    else if (document.getElementById("canvas") != null) {
        if (!confirm('Create new timeline?')) return;
    }


    //var numOfButtons = document.getElementById("divButtons").childElementCount; // get the number of buttons
    /*
    var labels = [];
    for(var ii=0;ii<numOfButtons;ii++){
    labels.push(document.getElementById("b" + ii).textContent);
    }*/

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.id = "canvas";
    document.getElementById("divTimeline").appendChild(canvas);
    // Draw grid, 20px for 1 minute, --> plotWidth + labels and totals
    // canvas width

    var textLength = ctx.measureText("ATC Record").width;

    var plotWidth; // this from lenght of time
    plotWidth = Math.ceil(ticks / 60) * 20; //20 pixel per min(60sec)
    var canvasWidth = plotWidth + textLength * 2 + 50;	// add room for totals and then some
    canvas.width = canvasWidth;

    // canvas height
    var topMargin = 50;
    var plotHeight = 80 + 20;
    var canvasHeight = plotHeight + 2 * topMargin;	// add margin and space for ticks
    canvas.height = canvasHeight

    var plotStart = textLength + 30; // where the plot starts (x), labels to the left

    // postion for labels
    var height = 50; // height of the horizontal bars
    var pos = (plotHeight - 20 - height) * 0.5 + topMargin;//[];

    // draw white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black"; // drawcolor back to black
    // axes
    ctx.moveTo(plotStart, plotHeight + topMargin);
    ctx.lineTo(plotStart + plotWidth, plotHeight + topMargin);
    ctx.stroke();

    ctx.moveTo(plotStart, plotHeight + topMargin);
    ctx.lineTo(plotStart, topMargin);
    ctx.stroke();

    // Y-ticks and labels
    var txt = "ATC Record";//document.getElementById("b" + ii).textContent;
    ctx.font = '12px sans-serif';
    ctx.fillText(txt, plotStart - (ctx.measureText(txt).width + 10), pos + height / 2 + 5);
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    // Draw a tick mark 12px long (-6 to 6)
    ctx.moveTo(plotStart - 6, pos + height / 2);
    ctx.lineTo(plotStart + 6, pos + height / 2);
    ctx.stroke();

    txt = "Timestamp";
    ctx.fillText(txt, plotStart - (ctx.measureText(txt).width + 10), pos + 55 + 20 / 2 + 5);
    ctx.moveTo(plotStart - 6, pos + 55 + 20 / 2);
    ctx.lineTo(plotStart + 6, pos + 55 + 20 / 2);
    ctx.stroke();

    // axes labels
    ctx.font = '12px sans-serif';
    ctx.fillText('Mins', plotStart + plotWidth + 10, plotHeight + topMargin + 25);



    // X-ticks and labels
    ctx.font = '12px sans-serif';
    ctx.fillText(ticksToTimeString(0), textLength, plotHeight + topMargin + 25);
    for (var ii = 0; ii <= plotWidth / 20; ii++) {//every 1 min, x-ticks mark
        ctx.beginPath(); //?
        ctx.lineWidth = 1;
        // Draw a tick mark 6px long (-3 to 3)
        ctx.setLineDash([]);
        ctx.strokeStyle = "#000000";
        ctx.moveTo(plotStart + 20 * ii, plotHeight + topMargin);
        ctx.lineTo(plotStart + 20 * ii, plotHeight + topMargin + 10);
        ctx.stroke();
        // Draw gridlines
        if (ii > 0 && ii % 5 == 0) {//every 5 min, solid gridlines
            ctx.beginPath();
            ctx.strokeStyle = "#8c8c8c";
            ctx.moveTo(plotStart + 20 * ii, plotHeight + topMargin - 2);
            ctx.lineTo(plotStart + 20 * ii, topMargin);
            ctx.stroke();
            ctx.font = '12px sans-serif';
            ctx.fillText(ii, plotStart + 20 * ii - 5, plotHeight + topMargin + 25);
        }
        else if (ii > 0) {//every 1 min, dashlines
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = "#cccccc";
            ctx.moveTo(plotStart + 20 * ii, plotHeight + topMargin - 2);
            ctx.lineTo(plotStart + 20 * ii, topMargin);
            ctx.stroke();
        }
    }
    //draw logo 
    var imgObject;
    imgObject = document.getElementById("logo");
    ctx.drawImage(imgObject, canvasWidth - 50, 5, 50, 18);
    //filename
    ctx.fillStyle = "Black"
    ctx.font = '12px sans-serif';
    var filenametxt = document.getElementById("filename").value;
    ctx.fillText(filenametxt, canvasWidth - 50 - ctx.measureText(filenametxt).width, 23);


    // Clear canvas!
    //canvas.style.visibility = "visible";
    var totals = 0;//[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var start, stop, len;

    for (var jj = 0; jj < data.length; jj++) {
        start = data[jj][0];
        stop = data[jj][1];
        len = stop - start;
        totals += len;

        ctx.fillStyle = timelineColors[jj % 2];
        ctx.fillRect(plotStart + start / 3, pos, (len / 3) < 1 ? 1 : len / 3, height); // /3 to scale 20px for 1 minute

        ctx.fillStyle = "Black"
        ctx.font = '10px sans-serif';
        ctx.fillText(jj + 1, plotStart + start / 3, (jj % 2 == 0 ? pos - 1 : pos + height + 8));
    }
    for (var i = 0; i < timestamp.length; i++) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(plotStart + Math.ceil(timestamp[i] * 20 / 60), pos + 55 + 20 / 2, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.fillStyle = "Black"
    ctx.font = '12px sans-serif';
    ctx.fillText(sec2time(ticks), plotStart + plotWidth + 20, pos + height / 2 + 2.5);

    //}

    // make clickable
    canvas.addEventListener('click', function () {
        window.open().document.write('<img style="max-width: 100%;" src="' + canvas.toDataURL() + '" />');
    }, false);

    // autoscroll to the bottom of the page to show the timeline
    window.scrollTo(0, document.body.scrollHeight);
    document.getElementById("divTable").innerHTML = renderTableHtml();
}

function saveTimeline() {
    // check if canvas exists and if not create it
    if (!document.getElementById("canvas")) {
        createTimeline();
    }
    var link = document.createElement("a");
    link.setAttribute('download', 'ATC_' + document.getElementById("filename").value + '_timeline');
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function renderTableHtml() {
    var tableHtml = "<table align='center'><tr><th>序數</th><th>開始記錄時間</th><th>送出時間</th><th>記錄文字</th></tr>";
    data.forEach(function (dataArray, index) {
        tableHtml += "<tr><td>" + (index + 1) + "</td><td>";
        tableHtml += ticksToTimeString(dataArray[0]) + "</td><td>";
        tableHtml += ticksToTimeString(dataArray[1]) + "</td><td>";
        tableHtml += dataArray[2].slice(1, -1);
        tableHtml += "</td></tr>";
    });
    tableHtml += "</table>";
    return tableHtml;
}