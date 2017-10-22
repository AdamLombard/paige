var request = require('request');
var moment = require('moment-timezone');

var joke = function(context, cb) {
  var jokes = [
    {
      joke: "What's the best time to go to the dentist?",
      punchline: "Tooth-hurty."
    },
    {
      joke: "Did you hear about the guy who invented Lifesavers?",
      punchline: "I hear he made a mint."
    },
    {
      joke: "How do you make a Kleenex dance?",
      punchline: "Put a little boogie in it."
    },
    {
      joke: "Why don't skeletons ever go trick-or-treating?",
      punchline: "Because they have no body to go with."
    },
    {
      joke: "Did you hear about the new restaurant on the moon?",
      punchline: "Great food, no atmosphere."
    },
    {
      joke: "Don't trust atoms.",
      punchline: "They literally make up everything."
    },
    {
      joke: "What did Mrs. Buffalo say to her youngest boy when he left for college?",
      punchline: "Bison."
    },
    {
      joke: "Why is it impossible to have a nose 12 inches long?",
      punchline: "Because it would be a foot."
    },
    {
      joke: "Did you hear Scarecrow won an award?!",
      punchline: "Yeah. He was out standing in his field."
    },
    {
      joke: "Did you hear Grape got stepped on?",
      punchline: "Yeah. He's okay, though. He just let out a little wine."
    },
    {
      joke: "I hate jokes about german sausage.",
      punchline: "They are the wurst."
    },
    {
      joke: "Last night I dreamt I was a muffler.",
      punchline: "I woke up exhausted."
    },
    {
      joke: "Why can't bycicles stand on their own?",
      punchline: "They're just two tired."
    },
    {
      joke: "Why don't crabs like to share?",
      punchline: "Because they're shellfish."
    }
  ];
  var jokeIdx;
  var returnMsg = '';

  var needsResponse = context.body.text.split(' ')[2];
  switch(needsResponse) {
    case undefined:
      jokeIdx = Math.floor(Math.random()*jokes.length);

      returnMsg += context.body.trigger_word + ' joke '+ jokeIdx + ' \n';
      returnMsg += jokes[jokeIdx].joke;

      cb(null, { text: returnMsg } );
      break;

    default:
      jokeIdx = needsResponse;
      returnMsg += jokes[jokeIdx].punchline
      setTimeout(function() {cb(null, { text: returnMsg } );}, 4000);
      break;
  }
}

var weather = function(context, cb) {
  var location = context.body.text.split(' ')[2];
  var weatherAPI = context.secrets.weatherURL
            + 'forecast?'
            + 'zip=' + location
            + '&appid=' + context.secrets.weatherToken;

  request.get(weatherAPI, function (error, res, body) {
    if (error) {
      console.log(error);
      cb(null, {text: "Hmm. That didn't work..."} );
    } else {
      var weatherData = JSON.parse(body);

      var icons = {
        "d": ":cityscape:",
        "n": ":night_with_stars:",
        
        // clear sky
        "01d": ":sunny:",
        "01n": ":night_with_stars:",
        
        // few clouds
        "02d": ":partly_sunny:",
        "02n": ":cloud:",
        
        // scattered clouds
        "03d": ":barely_sunny:",
        "03n": ":cloud:",
        
        // broken clouds
        "04d": ":cloud:",
        "04n": ":cloud:",
        
        // shower rain
        "09d": ":partly_sunny_rain:",
        "09n": ":rain_cloud:",
        
        // rain
        "10d": ":rain_cloud:",
        "10n": ":rain_cloud:",
        
        // thunderstorm
        "11d": ":lightning:",
        "11n": ":lightning:",
        
        // snow
        "13d": ":snowflake:",
        "13n": ":snowflake:",
        
        // mist
        "50d": ":fog:",
        "50n": ":fog:"
      };

      var forecasts = weatherData.list;
      var returnMsg = "Here's the weather for the next 24 hours in ";
      returnMsg += weatherData.city.name + "!";
      for (var i = 0; i <= 8; i ++) {
        var forecast = forecasts[i];
        var weatherIconCode = forecast.weather[0].icon;
        var cTemp = (forecast.main.temp - 273).toFixed(0);
        var fTemp = ((1.8 * cTemp) + 32).toFixed(0);
        var dayAndTime = moment.tz(forecast.dt * 1000, 'America/Los_Angeles').format('ddd h:mm a');
        var weatherDescription = forecast.weather[0].description;

        returnMsg += "\n\t";
        returnMsg += dayAndTime;
        returnMsg += "\n\t\t";
        returnMsg += icons[weatherIconCode] + "\t";
        returnMsg += cTemp + "°C (" + fTemp +"°F) with " + weatherDescription;
      }

      cb(null, { text: returnMsg } );
    }
  });
}

module.exports = function(context, cb) {
  var command = context.body.text.split(' ')[1];

  switch (command) {
    case 'test':
      test(context, cb, "hello")
      break;

    case 'weather':
      weather(context, cb)
      break;

    case 'joke':
      joke(context, cb);
      break;
  }
};
