require('dotenv').config();

module.exports = {
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiKey: process.env.TWILIO_API_KEY,
    apiSecret: process.env.TWILIO_API_SECRET,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    chatService: process.env.TWILIO_CHAT_SERVICE_SID,
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: process.env.TWILIO_ALLOW_INCOMING_CALLS === "true"
  }
};
