import express from 'express';
import bodyParser from 'body-parser';
import twilio from "twilio"
// Use a SMS service library like Twilio


const router = express.Router();
router.use(bodyParser.json());

// Generate a random 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification codes and their associated phone numbers (in-memory storage for simplicity)
const verificationCodes = {};

// Twilio configuration (replace with your own credentials)
const accountSid = 'AC7e56caff5114ee8d280dbf67f6cc976f';
const authToken = 'a809098c42d514b5d82b3614e02916d7';
const client = new twilio(accountSid, authToken);

// Endpoint to initiate phone number verification
router.post('/send-verification-code', async (req, res) => {
    const phoneNumber = req.body.phoneNumber;

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    // Store the verification code with the phone number
    verificationCodes[phoneNumber] = verificationCode;

    try {
        // Use Twilio (or your preferred SMS service) to send the verification code
        await client.messages.create({
            body: `Your verification code is: ${verificationCode}`,
            to: phoneNumber,
            from: '+12568010504',
        });

        res.status(200).json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});

// Endpoint to verify the entered code
router.post('/verify-code', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const enteredCode = req.body.code;

    // Retrieve the stored verification code
    const storedCode = verificationCodes[phoneNumber];

    if (enteredCode === storedCode) {
        // Codes match, phone number is verified
        res.status(200).json({ message: 'Phone number verified successfully' });
    } else {
        // Codes do not match
        res.status(400).json({ error: 'Invalid verification code' });
    }
});


export default router