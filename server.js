require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.post('/', (req, res) => {
	const { email, subject, message } = req.body;
	if (email.length === 0 || subject.length === 0 || message.length === 0) {
		res.status(400).json('One or more fields are empty!');
	}
	const emailMessage = {
		from: email,
		to: process.env.USER_TO,
		subject: subject,
		text: message,
		html: `<h3>${email}</h3><p>${message}</p>`
	}
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.USER_FROM,
			pass: process.env.USER_FROM_PASS
		}
	});
	transporter.sendMail(emailMessage, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).json("Could not send mail.");
		} 
		res.status(200).json("Email sent!");
	})
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Running on port ${PORT}`));