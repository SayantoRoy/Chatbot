const {actionssdk} = require('actions-on-google');
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const request =require('request');
// get this url from publish section in luis.ai
const LUIS_URL = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f588a0d2-6130-4993-9335-d2d5f8c508f8?verbose=true&timezoneOffset=0&subscription-key=9d5070cd8c834799be117244e756697e&q=';

const app = actionssdk({debug: true});

app.intent('actions.intent.MAIN', (conv) => {
  conv.ask('Hello There!!');
});

app.intent('actions.intent.TEXT', (conv, input) => {
  const url = `${LUIS_URL}${input}`;
  
  return rp({
    url,
    json: true,
  })
  .then((res) => {
    // create a function by intent detected by LUIS NLP
    const actionMap = {
      name: nameIntent,
      help: helpIntent,
    };
    // check that LUIS response with a valid intent
    if (res.topScoringIntent && res.topScoringIntent.intent && res.topScoringIntent.intent !== 'None') {
      
      // Map intents to functions for different responses
      actionMap[res['topScoringIntent']['intent']](conv);
      
    } else {      
      conv.ask('Sorry, I don\'t understand what you mean. Please try to ask for help or about my name.');
    }
  })
  .catch((e) => {
    console.log('Error =>', e);
  });
});

function nameIntent(conv) {
  conv.ask('My name is Doki and I simply talk.');
} 

function helpIntent(conv) {
  conv.ask('Do you know my name?');
}

express().use(bodyParser.json(), app).listen(8888);