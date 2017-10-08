var express = require("express");
var router = express.Router();
var path = require("path");
var firebase = require("firebase");
var text;
const functions = require('firebase-functions');

var defaultAppConfig = {
  apiKey: "AIzaSyB8a9Vk7XDkitajkfyWbapvL0UAX-Wk4SQ",
  authDomain: "wexler-f6765.firebaseapp.com",
  databaseURL: "https://wexler-f6765.firebaseio.com",
  storageBucket: "wexler-f6765.appspot.com",
};
var defaultApp = firebase.initializeApp(defaultAppConfig);

router.post('/test', function(req, res) {
var counter = 0;
var test1;
var newArray = [];
var api_key = 'key-7bfb3ffd65c2689d8ab8606b2f1c20f7';
var domain = 'sandbox5056b6306135476486c909ce79366194.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
firebase.database().ref().once("value", function(snapshot, prevChildKey) {
  var myData = [];
  var newPost = snapshot.val();

  snapshot.forEach(function(item) {

    var itemVal = item.val();
    
    for (var key in itemVal){

      //console.log(itemVal);
      myData.push(itemVal[key]);

    }

    //console.log(myData);
    for (var j = 0; j < myData.length; j++) {

      counter++;

      test1 = "<td>" + myData[j] + "</td>";

      if (counter <= 810) {

        if (j % 6 === 0) {
          newArray.push("</tr><tr>");
        }

      } else {

        if (counter === 811) {

          newArray.push("<br><tr><td>Scale</td><td>Scale Description</td><td>Question</td><td>Answer</td><td>Question Text</td></tr>");

        }

        if (j % 5 === 0) {
          newArray.push("</tr><tr>");
        }

    }
      //console.log("<p>" + myData[j] + "</p>");

      
  

      newArray.push(test1);

    }

  });
  
  console.log(counter);

  var stringed = newArray.toString();
  //console.log(stringed);
  var stringedAlong = stringed.replace(/\,/g,"");
  //console.log(stringedAlong);

  var data = {
    from: 'MMPI-2 Scoring <postmaster@sandbox5056b6306135476486c909ce79366194.mailgun.org>',
    to: 'jared@teachingtechservices.com',
    subject: 'Results',
    html: "Here is the data:" + "<table><thead><tr><td>Scale</td><td>Scale Description</td><td>Raw Score</td><td>K Score</td><td>T Score</td><td>% Answered</td></tr></thead><tbody><tr>"+ stringedAlong + "</tbody></table>"
  };

  setTimeout(function() {mailgun.messages().send(data, function (error, body) {
  console.log(body);

  if(!error) {
      res.send("Mail Sent");
    return; 
  }else
      res.send("Mail not sent");
  });

}, 2000);
  // for (var key in newPost){
  //   //console.log(newPost[key]);
  //   snapshot.forEach(childSnapshot => {
  //     myData.push(newPost[key]);
  //   })


  //   }

  //   console.log(myData);
  })

//console.log(test1);
  
});
    

router.get('/', function(req, res) {
    res.render('index');
}); 

router.post('/results', function(req,res){
var api_key = 'key-7bfb3ffd65c2689d8ab8606b2f1c20f7';
var domain = 'sandbox5056b6306135476486c909ce79366194.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
firebase.database().ref('entry').on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

})

var data = {
  from: 'MMPI-2 Scoring <postmaster@sandbox5056b6306135476486c909ce79366194.mailgun.org>',
  to: 'jared@teachingtechservices.com',
  subject: 'Results',
  text: "Here is the data:"
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body);

  if(!error)
  		res.send("Mail Sent");
  else
  		res.send("Mail not sent");
});

});


router.use('/', express.static('public'));

module.exports = router;
