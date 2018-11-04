
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAKP7sZ_MhEcunYlThbpzh-1EiUyBZ-pxc",
  authDomain: "homework-7-2857b.firebaseapp.com",
  databaseURL: "https://homework-7-2857b.firebaseio.com",
  projectId: "homework-7-2857b",
  storageBucket: "homework-7-2857b.appspot.com",
  messagingSenderId: "1080975002976"
};
firebase.initializeApp(config);




var database = firebase.database();

database.ref().on("value", function (snapshot) {
  var trainList = snapshot.val();
  console.log(trainList);
  var i = 1;
  var tbody = $("#tbody")
  tbody.empty();
  for (var prop in trainList) {

    var obj = trainList[prop];
    var name = obj['name'];
    var freq = parseInt(obj['freq']) * 60;
    var dest = obj['dest'];
    
    var firstTime = obj['firstTime']

    var th = $("<th>");
    th.attr("scope", "row");
    th.text(i)
    var tr = $("<tr>");
    var nameDiv = $("<td>");
    var freqDiv = $("<td>");
    freqDiv.addClass("freq");
    var destDiv = $("<td>");
    nameDiv.text(name); freqDiv.text(freq/60); destDiv.text(dest);
    tr.append(th);
    tr.append(nameDiv); tr.append(destDiv); tr.append(freqDiv);
    
    i++;

    var nextArrival = $("<td>");
    var timeToArrival = $("<td>");
    timeToArrival.addClass("timeToArrival");

   
    tr.append(nextArrival);
    tr.append(timeToArrival); 
    timeToArrival.attr("freq", freq);

    
    nextArrival.text(calculateTrainTimes(freq ,firstTime));
    var time  = minTillTrain (freq,firstTime);
    timeToArrival.text((Math.ceil(time/60)));
    timeToArrival.attr("time",time )
    tbody.append(tr);
  }
  setInterval(trainTimer,1000);
});

$("#submitButton").click(function () {
  var name = $("#trainName").val();
  var freq = $("#trainFrequency").val();
  var dest = $("#trainDest").val();
  database.ref().push({
    "name": name,
    "freq": freq,
    "dest": dest,
    "firstTime": $("#firstTime").val()
  })
});

function minTillTrain (tFrequency, firstTime) {

  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTimeConverted), "seconds");
  
  var tRemainder = diffTime % (tFrequency);
  var tMinutesTillTrain = tFrequency - tRemainder;
  return  tMinutesTillTrain;
}

function calculateTrainTimes(tFrequency, firstTime) {
  var nextTrain = moment().add(minTillTrain(tFrequency,firstTime), "seconds");
  return  moment(nextTrain).format("hh:mm");

}

function trainTimer () {
  var trainTimers = document.getElementsByClassName("timeToArrival");
  for (var i = 0; i < trainTimers.length;i++){
    var time = $(trainTimers[i]);
    var text = parseInt(time.attr("time"));
    var newtime = text - 1;
    if (text === 0){
       newtime = time.attr("freq");
    } 
    time.text(Math.ceil(newtime/60));
    time.attr("time",newtime)
  }
}

