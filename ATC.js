  // initialize data-array
	var data;
  var timestamp = [];
  var readyToRecord = false;
	function clearData(){
		data = [];
        timestamp = [];/*
		var startSTR = 'start';
		var stopSTR = 'stop';
		var numOfButtons = document.getElementById("divButtons").childElementCount;
		
		for(ii=0; ii<numOfButtons; ii++){
			data.push(['start' + parseInt(ii)]);
			data.push(['stop' + parseInt(ii)]);
		} */
	}
	clearData();	
  //console.log(data);		
  
  var tmp;
  var ticks = 0;
  var masterRunning = false;
  var running = []; // as many as buttons
  var nowTimeTicks = 0;
  var startTime;

  /*
  function forTest(){//add extra seconds to see the result
    var mySec = document.getElementById("Secs").value;
    console.log(mySec);
    ticks += parseInt(mySec);
  }

  // Add button
  function addButton(name) {
    if (masterRunning) return alert("No adding buttons while timer is running!");
    buttons = document.getElementById("divButtons")
    var numOfButtons = buttons.childElementCount;
    if (numOfButtons < 12) {
      var id = "b" + parseInt(numOfButtons);
      var functionName = "timeStamp('" + parseInt(numOfButtons) + "')";
      var btn = document.createElement("BUTTON");
      btn.i
      btn.id = id;
      btn.className = "buttonMain";
      btn.setAttribute("onclick", functionName);
      if (name == undefined) {
        btn.innerHTML = numOfButtons;
        document.getElementById("divButtons").appendChild(btn);
        saveButtons()
      }
      else {
        btn.innerHTML = name;
        document.getElementById("divButtons").appendChild(btn);
      }

      data.push(['start' + parseInt(numOfButtons)]);
      data.push(['stop' + parseInt(numOfButtons)]);
      running.push(false);

    }
    else { alert("12 buttons max!\nIf you need more open another timer."); }
  }

  // Remove Button
  function removeButton() {
    if(masterRunning) return alert("No removing buttons while timer is running!");
    buttons = document.getElementById("divButtons")
    var numOfButtons = buttons.childElementCount;
    if(numOfButtons>2){
      var id = "b" + parseInt(numOfButtons-1);
      removed = document.getElementById(id);
      buttons.removeChild(removed);
      data.splice(data.length-2, 2);
      running.pop();
      saveButtons();
    }
    else {alert("Timer has to have atleast two buttons!");}
  }

  // Rename buttons
  function renameButtons() {
    buttons = document.getElementById("divButtons")
    var numOfButtons = buttons.childElementCount;
    // for-looppi kaikille napeille
    for(ii=0; ii<numOfButtons; ii++){
      var tmpId = "b" + parseInt(ii);
      var tmpButton = document.getElementById(tmpId);
      var txt = prompt("Please enter text for button", tmpButton.innerHTML);
      //if (txt.length > 30) {txt = txt.substring(0,29) + "...";} // Ei hyvä tapa, ei skaalaudu
      tmpButton.innerHTML = txt;
    }
    saveButtons();
  }

  function myRename(btnID){
    alert(btnID);
    var txt = prompt("Please enter text for button", this.innerHTML);
    document.getElementById(btnID).innerHTML = txt;
  }
  */

  // Original timer by Leon Williams @
  // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
  /**
   * Self-adjusting interval to account for drifting
   * 
   * @param {function} workFunc  Callback containing the work to be done
   *                             for each interval
   * @param {int}      interval  Interval speed (in milliseconds) - This 
   * @param {function} errorFunc (Optional) Callback to run if the drift
   *                             exceeds interval
   */
  function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
        //stopAll();
    }
    
    this.clear = function() {
       var elem = document.getElementById("bM");
      if(!confirm('Are you sure? Clear data and reset timer.')) return;
      ticker.stop();
      $("#bM").removeClass("btn-warning");
      $("#bM").addClass("btn-primary");
      elem.innerHTML = "Start";
      $("#bM").removeClass("disabled");
      masterRunning = false;
      //stopAll();
      ticks = 0;
      document.getElementById("MasterTime").innerHTML = "00:00";
      document.getElementById("recordText").value = "";
      document.getElementById("divTable").innerHTML = "";
      document.getElementById("recordTime").innerHTML = "00:00:00";
      document.getElementById("startRecord").innerHTML = "輸入";
      $("#startRecord").addClass("disabled");
      $("#sendRecord").addClass("disabled");
      document.getElementById("recordText").disabled = true;
      $("#inserTime").addClass("disabled");
      readyToRecord = false;
      clearData();
      clearTimeline();
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
  }

  // Define the work to be done
  var doWork = function() {
    ++ticks;
    console.log(ticks); // time goes up
    var minutes = Math.floor(ticks/60);
    var seconds = ticks - (60*minutes);
    if (seconds.toString().length < 2){seconds = '0' + seconds.toString()}
    if (minutes.toString().length < 2){minutes = '0' + minutes.toString()}
    document.getElementById("MasterTime").innerHTML = minutes + ':' + seconds;
  };

  // Define what to do if something goes wrong
  var doError = function() {
      console.warn('The drift exceeded the interval.');
  };

  // (The third argument is optional)
  var ticker = new AdjustingInterval(doWork, 1000, doError);

  function masterStartStop() {
    var elem = document.getElementById("bM");
    if (masterRunning == false){
      ticker.start();
      $("#bM").removeClass("btn-primary");
      $("#bM").addClass("btn-warning");
      $("#startRecord").removeClass("disabled");
      
      elem.innerHTML = "Stop";
      masterRunning = true;
      startTime = Date.now();
    } else {
      ticker.stop();
      $("#bM").removeClass("btn-warning");
      $("#bM").addClass("btn-primary");
      $("#bM").addClass("disabled");
      elem.innerHTML = "Finish";
      masterRunning = false;
      
      $("#sendRecord").addClass("disabled");
      $("#startRecord").addClass("disabled");
      document.getElementById("recordText").disabled = true;
      $("#inserTime").addClass("disabled");
    }
  }
  function inserTime(){
      var time = new Date();
      var h = time.getHours()<10 ? "0" + time.getHours() : time.getHours();
      var m = time.getMinutes()<10 ? "0" + time.getMinutes() : time.getMinutes();
      var s = time.getSeconds()<10 ? "0" + time.getSeconds() : time.getSeconds();
      document.getElementById("recordText").value += " " + h + ":" + m + ":" + s + " ";
      document.getElementById("recordText").focus();
      timestamp.push(ticks);
  }
  /*
  function getNowTime(){
    var time = new Date();
    var h = time.getHours()<10 ? "0" + time.getHours() : time.getHours();
    var m = time.getMinutes()<10 ? "0" + time.getMinutes() : time.getMinutes();
    nowTime = h + ":" + m;
  }*/

  /*
  function stopAll(){
    for (var ii = 0; ii<running.length; ii++){
      if (running[ii] == true){
        tmp = 'stop' + ii;
        for(var k = 0; k < data.length; k++){
          if(data[k][0] == tmp){
            found = k;
          }
        }
        data[found].push(ticks);
        document.getElementById("b" + ii).style.background =  "#009bff";
        running[ii] = false;
      }
    }
  }
  function timeStamp(input) {
    var idx = parseInt(input)
    var found = false;
    if (running[idx] == false) {
      tmp = 'start' + input;
      for(var k = 0; k < data.length; k++){
        if(data[k][0] == tmp){
          found = k;
        }
      }		
      data[found].push(ticks);
      document.getElementById("b" + input).style.background =  "#3ddc97";
      running[idx] = true;
      }
    else {
      tmp = 'stop' + input;
      for(var k = 0; k < data.length; k++){
        if(data[k][0] == tmp){
          found = k;
        }
      }
      data[found].push(ticks);
      document.getElementById("b" + input).style.background =  "#009bff";
      running[idx] = false;
    }
  }*/
$(document).keydown(function(e){
    if(masterRunning && e.ctrlKey && e.which === 13) {
        $("#startRecord").click();
        e.preventDefault();
    }
});
$("#recordText").keydown(function(e){
    if(e.shiftKey && e.which === 13){
        $("#sendRecord").click();
        e.preventDefault();
    }else if(e.ctrlKey && e.which === 65){
        $("#inserTime").click();
        e.preventDefault();
    }
});

  function startRecord(input){
    if(!masterRunning){
      alert("Please start the timer first.")
      return;
    }
    nowTimeTicks = ticks;
    document.getElementById("recordTime").innerHTML = ticksToTimeString(ticks);

    if(readyToRecord){
      document.getElementById("recordText").focus();
    }else {
      readyToRecord = !readyToRecord;
      document.getElementById("startRecord").innerHTML = "更新記錄時間";
      document.getElementById("recordText").disabled = false;
      $("#inserTime").removeClass("disabled");
      $("#sendRecord").removeClass("disabled");
      document.getElementById("recordText").focus();
    }
  }
  function sendRecord(input){
    if(!masterRunning){
      alert("Please start the timer first.")
      return;
    }
    if(readyToRecord){
      readyToRecord = false;
      document.getElementById("startRecord").innerHTML = "輸入";
      var recordText = '"'+document.getElementById("recordText").value.replace(/"/g,'""')+'"';
      data.push([nowTimeTicks,ticks,recordText]);
      $("#sendRecord").addClass("disabled");
      document.getElementById("recordText").disabled = true;
      $("#inserTime").addClass("disabled");
      document.getElementById("recordText").value = "";
    }else{
      alert("請先點選開始記錄後才能送出記錄資料。");
    }
  }

  function transpose(inputArray) {
    // find length of longest inner array
    var len = 0;
    for(ii=0; ii<inputArray.length; ii++){
      var inputLen = inputArray[ii].length;
      if(inputLen > len){len = inputLen};
    }
    // if inner arrays length less than longest, add necessary nulls
    for(ii=0; ii<inputArray.length; ii++){
      var diff = len - inputArray[ii].length;
      console.log(diff);
      if(diff>0){
        for(jj=0; jj<diff; jj++){inputArray[ii].push(null)}
        }
    }
    // return transposed array
    return inputArray[0].map((col, c) => inputArray.map((row, r) => inputArray[r][c]));
  }

  // Saving data as csv-file, default filename is current date 
  var filename = new Date().toLocaleDateString();
  document.getElementById("filename").value = filename;

  function getData(){
    dataT = data;
  // Building the CSV from the Data two-dimensional array
  // Each column is separated by "," and new line "\n" for next row
    var csvContent = '序數,開始記錄時間,送出時間,記錄文字\n';
    dataT.forEach(function(infoArray, index) {
      var dataString = "";
      dataString += ticksToTimeString(infoArray[0]) + ",";
      dataString += ticksToTimeString(infoArray[1]) + ",";
      dataString += infoArray[2];
      csvContent += (index+1) + ',' +  dataString + '\n';
    });
    filename += '.csv';
    download(csvContent, filename, 'text/csv;encoding:utf-8');
  }
  // Original function for downloading csv by Arne H. Bitubekk @
  // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
  // The download function takes a CSV string, the filename and mimeType as parameters
  function download(content, fileName, mimeType) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';
    if (navigator.msSaveBlob) { // IE10
      navigator.msSaveBlob(new Blob(["\uFEFF" + content], {
        type: mimeType
      }), fileName);
    } else if (URL && 'download' in a) { //html5 A[download]
      a.href = URL.createObjectURL(new Blob(["\uFEFF" + content], {
        type: mimeType
      }));
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
  }
    

  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("infoButton");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    
  }
  /*
  function saveButtons() {
    var  buttonNames = [];
    buttons = document.getElementById("divButtons")
    var numOfButtons = buttons.childElementCount;
    // for-looppi kaikille napeille
    for(ii=0; ii<numOfButtons; ii++){
      var tmpId = "b" + parseInt(ii);
      var tmpButton = document.getElementById(tmpId);
      buttonNames.push(tmpButton.innerHTML);
    }
    localStorage.buttonNames = JSON.stringify(buttonNames);
    console.log(buttonNames);
  }*/

  function delLocal(){
    localStorage.clear();
  }

  /*
  function clearButtonDiv(){
    const myNode = document.getElementById("divButtons");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.lastChild);
    }
    
  }

  function createButtons(){
    clearButtonDiv() // clear current buttons before creating new buttons
    
    if (typeof(Storage) !== "undefined") {
      if(localStorage.buttonNames){
        var storedNames = JSON.parse(localStorage.buttonNames);
        for(var ii=0; ii<storedNames.length; ii++){
          addButton(storedNames[ii]);
          running.push(false);
        } 
      }else {
        for(var ii=0;ii<6;ii++){
          addButton(ii);
          running.push(false);
        }
      }
      
    } else {
      console.log("Sorry, your browser does not support web storage...");
    }
  }
  */

  //window.onbeforeunload = function() {
  //	if(masterRunning){
  //	return "You sure? Timer is still running.";	
  //	}
  //}

  // if (typeof variable !== 'undefined') {
      // the variable is defined