require("dotenv").config();

const token = process.env.TWILIO_TOKEN;
const sid = process.env.TWILIO_SID;

const client = require('twilio')(sid, token);
async function sendMessage(retailer) {
    try {
        await client.messages.create({
            from: process.env.TWILIO_NUMBER,
            to: process.env.PHONE_NUMBER,
            body: `Alert! ${retailer} might have PS5 in stock!`
        })
    } catch (e) {
        console.log(e.message);
        console.log("there was an error")
    }
    
}

module.exports = sendMessage
