//Firebase
var config = {
  apiKey: "AIzaSyBhbZC8hdSI0Lyj3VmLObzGME9KPtv3W0E",
  authDomain: "train-schedule-project-bfd32.firebaseapp.com",
  databaseURL: "https://train-schedule-project-bfd32.firebaseio.com",
  projectId: "train-schedule-project-bfd32",
  storageBucket: "train-schedule-project-bfd32.appspot.com",
  messagingSenderId: "1001000810553"
};

firebase.initializeApp(config);
var database = firebase.database();

//Dynamic button creation
$("#add-train-btn").on("click", function () {

  event.preventDefault();

  var trName = $("#train-name-input").val().trim();
  var trDest = $("#destination-input").val().trim();
  var trTime = $("#first-train-input").val().trim();
  var trFreq = $("#frequency-input").val().trim();

  var newTrain = {
    name: trName,
    dest: trDest,
    firstTrain: trTime,
    freq: trFreq
  };

  database.ref().push(newTrain);

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");


});

//Grabing data from Firebase and calulation for next arrival time
database.ref().on("child_added", function (snapshot, prevChildKey) {

  var trName = snapshot.val().name;
  var trDest = snapshot.val().dest;
  var trTime = snapshot.val().firstTrain;
  var trFreq = snapshot.val().freq;



  //Moment JS

  var tempArray = [];
  var trStartTime = moment(trTime, "HH:mm");
  var endOfDay = moment("23:59", "HH:mm");
  console.log(endOfDay.format("HH:mm d"));

  while (trStartTime.format("d") === endOfDay.format("d")) {
    tempArray.push(trStartTime.format("HH:mm"));
    trStartTime = trStartTime.add(parseInt(trFreq), "m");
  }
  //var currentTime = moment();

  var trainStartforNxtArrival = moment(trTime, "HH:mm");

  for (var i = 0; i < tempArray.length; i++) {

    if (moment().isBefore(moment(tempArray[i], "HH:mm"))) {
      var nextArrival = tempArray[i];
      var nextArrivalPretty = moment(nextArrival, "HH:mm").format("hh:mm A");

      break
    }
  }

  //calculate minutes away
  var minutesAway = moment(nextArrival, "HH:mm").diff(moment(), 'minutes');

  // Check the train-schedule.html file line 43, dynamic row creating
  $("#train-table > tbody").append(`<tr><td> ${trName} </td><td> ${trDest} </td><td> ${trFreq} </td><td> ${nextArrivalPretty} </td><td> ${minutesAway} </td></tr>`);

});