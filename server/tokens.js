const config = require('./config');
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const { ChatGrant, VideoGrant, VoiceGrant } = AccessToken;

const createRoom = async (roomName) => {
  const twilioClient = twilio(
    config.twilio.accountSid,
    config.twilio.authToken
  );

  try {
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    if(error.status === 404) {
      await twilioClient.video.rooms.create({
        type: 'peer-to-peer',
        uniqueName: roomName,
      });
    }
  }
};

const generateToken = (config) => {
  return new AccessToken(
    config.twilio.accountSid,
    config.twilio.apiKey,
    config.twilio.apiSecret
  );
};

const chatToken = (identity, config) => {
  const chatGrant = new ChatGrant({
    serviceSid: config.twilio.chatService,
  });
  const token = generateToken(config);
  token.addGrant(chatGrant);
  token.identity = identity;
  return token;
};

const videoToken = async (identity, room, config) => {
  let videoGrant;
  await createRoom(room);
  if (typeof room !== 'undefined') {
    videoGrant = new VideoGrant({ room });
  } else {
    videoGrant = new VideoGrant();
  }
  const token = generateToken(config);
  token.addGrant(videoGrant);
  token.identity = identity; 
  return token;
};

const voiceToken = (identity, config) => {
  let voiceGrant;
  if (typeof config.twilio.outgoingApplicationSid !== 'undefined') {
    voiceGrant = new VoiceGrant({
      outgoingApplicationSid: config.twilio.outgoingApplicationSid,
      incomingAllow: config.twilio.incomingAllow,
    });
  } else {
    voiceGrant = new VoiceGrant({
      incomingAllow: config.twilio.incomingAllow,
    });
  }
  const token = generateToken(config);
  token.addGrant(voiceGrant);
  token.identity = identity;
  return token;
};

module.exports = { chatToken, videoToken, voiceToken };
