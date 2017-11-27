"use strict";

// - required external libraries and functions
const 
  REQUEST = require('request'),
  MOMENT = require('moment-timezone'),
  UUID = require('uuid');

// - program constants
const
  NEWLINE = "\n",
  TAB = "\t";

// - constant objects
const 
  JOKES = [
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
    },
    {
      joke: "What do you call fake spaghetti?",
      punchline: "Impasta!"
    },
    {
      joke: "What do you call a pony with a sore throat?",
      punchline: "A little horse."
    },
    {
      joke: "What do you call cheese that isn't yours?",
      punchline: "Nacho cheese."
    },
    {
      joke: "Never get a hair cut.",
      punchline: "If you're gonna spend money, you should get them all cut at once."
    },
    {
      joke: "What does an annoying pepper do?",
      punchline: "It gets jalapeño face."
    },
    {
      joke: "Wanna hear a joke about paper?",
      punchline: "Nevermind. It's tearable."
    },
    {
      joke: "What does an annoying pepper do?",
      punchline: "It gets jalapeño face."
    },
    {
      joke: "What's the difference between a short-wearing unicyclist and suit-wearing bicyclist?",
      punchline: "Attire."
    }
  ],
  COMMANDS = [
    {
      id: "convert",
      description: "Ask me to `convert` any unit of measurement into any other unit and I'll... I'll see what I can do. I'm pretty good at understanding lots of measurement abbreviations!",
      examples: [
        "convert 2 cups to tablespoons",
        "convert 1 1/2 kg to lb",
        "convert 6 pounds 7 oz to kg"
      ]
    },
    {
      id: "help",
      description: "You can ask me for `help` with any command! (You can even ask for `help` with the `help` command, which you already know because it's the only way to read this, so... help-ception!)",
      examples: [
        "help weather"
      ]
    },
    {
      id: "joke",
      description: "This is my favorite one! _Please_ ask me to tell you a `joke`. I promise that none of my jokes are terrible puns -- by which, I mean ALL of my jokes are terrible puns.",
      examples: [
        "joke"
      ]
    },
    {
      id: "kitten",
      description: "OMG kittens! Ask me for a `kitten` and I'll generate a completely unique and random one, just for you. Or, you can hand me any word or sentence, and I'll make a kitten just for that phrase, and I'll remember when you ask me again later. (Slack won't show it twice back-to-back, so you may need to wait an hour to see it again.) Try asking for a kitten that matches your name!",
      examples: [
        "kitten",
        "kitten santa",
        "kitten settlers of catan"
      ]
    },
    {
      id: "roll",
      description: "Greetings, Dungeon Master! Sometimes you just need a random roll of the die, and at those times I've got your back. Ask me to `roll`, and I'll tell you the answer for a single, random roll of a six-sided die. Or, you can ask me for any number of rolls for a die of any number of sides! Try asking me for a thousand rolls of a d20!",
      examples: [
        "roll",
        "roll d20",
        "roll 5 d6"
      ]
    },
    {
      id: "weather",
      description: "Ask me for the `weather` for any zip code, and I'll give you the forecast there for the next 24 hours! With icons! (This isn't _super_ accurate right now, but I'm looking for a better data source, so... stay tuned!)",
      examples: [
        "weather 90210"
      ]
    }
  ];

// - helper functions
let hashedStr = (s) => {
  let
    char,
    hashedStr = '';

  for (char of s) {
    hashedStr += char.charCodeAt();
  }

  return hashedStr;
};

// - bot commands
let convert = (cb, params, context) => {
  let conversionRequest = params.join('+');
  let conversionAPI = context.secrets.conversionURL
    + 'input=' + conversionRequest
    + '&format=plaintext'
    + '&output=JSON'
    + '&appid=' + context.secrets.conversionToken;
    
  REQUEST.get(conversionAPI, (error, res, body) => {
    if (error) {
      console.log(error);
      cb(null, {text: "Sorry! I don't know how to do that..."} );
    } else { 
      let conversionData = JSON.parse(body);
      let returnMsg = conversionData.queryresult.pods.find(o => (o.id === 'Result')).subpods[0].plaintext;
    
      cb(null, { text: returnMsg });
    }
  });
};

let help = (cb, params, context) => {
  let 
    returnMsg = "",
    command = params[0];

  if (command) {
    let 
      commandInfo = COMMANDS.find(c => (c.id === command));

    returnMsg += "Sure! Here's some info on the `"+ command + "` command:" + NEWLINE;
    returnMsg += NEWLINE;
    returnMsg += "DESCRIPTION:" + NEWLINE;
    returnMsg += commandInfo.description + NEWLINE;
    returnMsg += NEWLINE;
    returnMsg += "EXAMPLES:" + NEWLINE;

    for (let example of commandInfo.examples) {
      returnMsg += TAB + "`" + context.body.trigger_word + " " + example + "`" + NEWLINE;
    }

    cb(null, { text: returnMsg } );
  } else {
    paige(cb);
  }
};

let joke = (cb, params, context) => {
  let 
    jokeIdx,
    needsResponse = params[0],
    returnMsg = '';

  console.log(params);

  switch(needsResponse) {
    case undefined:
      jokeIdx = Math.floor(Math.random()*JOKES.length);

      returnMsg += context.body.trigger_word + " joke "+ jokeIdx + " " + NEWLINE;
      returnMsg += JOKES[jokeIdx].joke;

      cb(null, { text: returnMsg } );
      break;

    default:
      jokeIdx = needsResponse;
      returnMsg += JOKES[jokeIdx].punchline + ' :laughing:';

      setTimeout(() => {cb(null, { text: returnMsg })}, 4000);
      break;
  }
};

let kitten = (cb, params, context) => {
  let kittenAPI,
      kittenID,
      seedString = params.join('');
  
  if (seedString) {
    kittenID = hashedStr(seedString);
  } else {
    kittenID = UUID();
  }
  
  kittenAPI = context.secrets.kittenURL
    + kittenID + '.png?'
    + 'set=set4';
    
  cb(null, { text: kittenAPI });
};

let paige = (cb) => {
  let returnMsg = "";
  returnMsg  = "";
  returnMsg  = "Hi! I'm Paige!" + NEWLINE;
  returnMsg += NEWLINE;
  returnMsg += "To get my assistance, type `paige <command> <details>`." + NEWLINE;
  returnMsg += NEWLINE;
  returnMsg += "Here are the commands I know:" + NEWLINE;

  for (let command of COMMANDS) {
    returnMsg += TAB + command.id + NEWLINE;
  }

  returnMsg += NEWLINE;
  returnMsg += "If you type `paige help <command>`, I'll tell you more about a specific command. Try it! :smile:";

  cb(null, { text: returnMsg });
}

let roll = (cb, params) => {
  let 
    numOfDice = 1,
    typeOfDie = 'd6',
    rolledDice = [];

  switch (true) {
    case (!params[0] && !params[1]):
      break;

    case (params[0] && !params[1]):
      typeOfDie = params[0];
      break;

    default:
      numOfDice = params[0];
      typeOfDie = params[1];
      break;
  }

  let sizeOfDie = typeOfDie.slice(1);
  for (let i = 0; i < numOfDice; i++) {
    rolledDice.push(' ' + Math.ceil(Math.random() * sizeOfDie));
  }

  cb(null, { text: rolledDice.toString() });
};

let weather = (cb, params, context) => {
  let 
    location = params[0],
    weatherAPI = context.secrets.weatherURL
      + 'forecast?'
      + 'zip=' + location
      + '&appid=' + context.secrets.weatherToken;

  REQUEST.get(weatherAPI, (error, res, body) => {
    if (error) {
      console.log(error);
      cb(null, {text: "Hmm. That didn't work..."} );
    } else {
      let weatherData = JSON.parse(body);

      let icons = {
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

      let forecasts = weatherData.list;
      let returnMsg = "Here's the weather for the next 24 hours in ";
      returnMsg += weatherData.city.name + "!";
      for (let i = 0; i <= 8; i ++) {
        let forecast = forecasts[i];
        let weatherIconCode = forecast.weather[0].icon;
        let cTemp = (forecast.main.temp - 273).toFixed(0);
        let fTemp = ((1.8 * cTemp) + 32).toFixed(0);
        let dayAndTime = MOMENT.tz(forecast.dt * 1000, 'America/Los_Angeles').format('ddd h:mm a');
        let weatherDescription = forecast.weather[0].description;

        returnMsg += "\n\t";
        returnMsg += dayAndTime;
        returnMsg += "\n\t\t";
        returnMsg += icons[weatherIconCode] + "\t";
        returnMsg += cTemp + "°C (" + fTemp +"°F) with " + weatherDescription;
      }

      cb(null, { text: returnMsg });
    }
  });
};


// - bot command router
module.exports = (context, cb) => {
  let 
    command = context.body.text.split(' ')[1],
    params = context.body.text.split(' ').slice(2);

  switch (command) {
    case 'convert':
      convert(cb, params, context);
      break;

    case 'help':
      help(cb, params, context);
      break;

    case 'joke':
      joke(cb, params, context);
      break;

    case 'kitten':
      kitten(cb, params, context);
      break;

    case 'roll':
      roll(cb, params);
      break;

    case 'weather':
      weather(cb, params, context);
      break;

    default:
      paige(cb);
  }
};
