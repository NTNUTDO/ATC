// initialize data-array
var data;
var timestamp = [];
var readyToRecord = false;
function clearData() {
  data = [];
  timestamp = [];
}
clearData();
//console.log(data);		

var tmp;
var ticks = 0;
var masterRunning = false;
var running = []; // as many as buttons
var nowTimeTicks = 0;
var startTime;

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

  this.start = function () {
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval);
  }

  this.stop = function () {
    clearTimeout(timeout);
    //stopAll();
  }

  this.clear = function () {
    var elem = document.getElementById("bM");
    if (!confirm('Are you sure? Clear data and reset timer.')) return;
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
    timeout = setTimeout(step, Math.max(0, that.interval - drift));
  }
}

// Define the work to be done
var doWork = function () {
  ++ticks;
  console.log(ticks); // time goes up
  var minutes = Math.floor(ticks / 60);
  var seconds = ticks - (60 * minutes);
  if (seconds.toString().length < 2) { seconds = '0' + seconds.toString() }
  if (minutes.toString().length < 2) { minutes = '0' + minutes.toString() }
  document.getElementById("MasterTime").innerHTML = minutes + ':' + seconds;
};

// Define what to do if something goes wrong
var doError = function () {
  console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

function masterStartStop() {
  var elem = document.getElementById("bM");
  if (masterRunning == false) {
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
function inserTime() {
  var time = new Date();
  var h = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
  var m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
  var s = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
  document.getElementById("recordText").value += " " + h + ":" + m + ":" + s + " ";
  document.getElementById("recordText").focus();
  timestamp.push(ticks);
}

$(document).keydown(function (e) {
  if (masterRunning && e.ctrlKey && e.which === 13) {
    $("#startRecord").click();
    e.preventDefault();
  }
});
$("#recordText").keydown(function (e) {
  if (e.shiftKey && e.which === 13) {
    $("#sendRecord").click();
    e.preventDefault();
  } else if (e.ctrlKey && e.which === 65) {
    $("#inserTime").click();
    e.preventDefault();
  }
});

function startRecord(input) {
  if (!masterRunning) {
    alert("Please start the timer first.")
    return;
  }
  nowTimeTicks = ticks;
  document.getElementById("recordTime").innerHTML = ticksToTimeString(ticks);

  if (readyToRecord) {
    document.getElementById("recordText").focus();
  } else {
    readyToRecord = !readyToRecord;
    document.getElementById("startRecord").innerHTML = "更新記錄時間";
    document.getElementById("recordText").disabled = false;
    $("#inserTime").removeClass("disabled");
    $("#sendRecord").removeClass("disabled");
    document.getElementById("recordText").focus();
  }
}
function sendRecord(input) {
  if (!masterRunning) {
    alert("Please start the timer first.")
    return;
  }
  if (readyToRecord) {
    readyToRecord = false;
    document.getElementById("startRecord").innerHTML = "輸入";
    var recordText = '"' + document.getElementById("recordText").value.replace(/"/g, '""') + '"';
    data.push([nowTimeTicks, ticks, recordText]);
    $("#sendRecord").addClass("disabled");
    document.getElementById("recordText").disabled = true;
    $("#inserTime").addClass("disabled");
    document.getElementById("recordText").value = "";
  } else {
    alert("請先點選開始記錄後才能送出記錄資料。");
  }
}

function transpose(inputArray) {
  // find length of longest inner array
  var len = 0;
  for (ii = 0; ii < inputArray.length; ii++) {
    var inputLen = inputArray[ii].length;
    if (inputLen > len) { len = inputLen };
  }
  // if inner arrays length less than longest, add necessary nulls
  for (ii = 0; ii < inputArray.length; ii++) {
    var diff = len - inputArray[ii].length;
    console.log(diff);
    if (diff > 0) {
      for (jj = 0; jj < diff; jj++) { inputArray[ii].push(null) }
    }
  }
  // return transposed array
  return inputArray[0].map((col, c) => inputArray.map((row, r) => inputArray[r][c]));
}

// Saving data as csv-file, default filename is current date 
var filename = new Date().toLocaleDateString();
document.getElementById("filename").value = filename;

function getData() {
  // 檢查資料有效性
  if (!data || data.length === 0) {
    alert("There is no data.");
    return;
  }

  // 1. 定義表頭
  const header = ['序數', '開始記錄時間', '送出時間', '記錄文字'];
  // SheetJS 需要一個包含所有資料的二維陣列 (包括表頭)
  const sheetData = [header];

  // 2. 轉換資料格式 (將 ticks 轉換為時間，並加入序數)
  data.forEach((infoArray, index) => {
    // infoArray[0] 和 infoArray[1] 假定是 ticks 數值
    // infoArray[2] 假定是記錄文字
    const row = [
      index + 1,                                // 序數
      ticksToTimeString(infoArray[0]),          // 開始記錄時間 (已轉換)
      ticksToTimeString(infoArray[1]),          // 送出時間 (已轉換)
      infoArray[2]                              // 記錄文字
    ];
    sheetData.push(row);
  });

  // 3. 檔案名稱消毒與組裝
  const safeFilename = filename.replace(/[\\/:*?"<>|]/g, '_');
  const fullFilename = `ATC_${safeFilename}.xlsx`;

  // 4. 建立工作簿 (Workbook) 與工作表 (Worksheet)
  const workbook = XLSX.utils.book_new();
  // 使用 aoa_to_sheet 將二維陣列轉換為工作表
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 將工作表加入工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // 5. 寫入檔案並觸發下載 (SheetJS 會自動處理瀏覽器下載行為)
  XLSX.writeFile(workbook, fullFilename);
}
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("infoButton");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function delLocal() {
  localStorage.clear();
}

window.addEventListener("online", function (event) {
  event.stopPropagation();
  console.log("網路已重新連線，但不會自動刷新頁面");
});