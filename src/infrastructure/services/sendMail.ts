import SENDMAIL from "../../useCase/interface/sendMail";
import nodemailer from 'nodemailer';

class GenerateEmail implements SENDMAIL {
    sendMail(email: string, otp: number): void {
        const mailData = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>One-Time Password (OTP)</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">One-Time Password (OTP) for Verification</h2>
            <p>Dear User,</p>
            <p>Your one-time password (OTP) for verification is:</p>
            <h1 style="text-align: center; font-size: 36px; padding: 20px; background-color: #f2f2f2; border-radius: 5px;">${otp}</h1>
            <p>Please use this OTP to complete your verification process.</p>
            <p>This OTP is valid for a single use and will expire after a short period of time.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Derby Dome</p>
        </body>
        </html>
    `;
        let mailTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY
            }
        });

        let details = {
            from: process.env.EMAIL,
            to: email,
            subject: "One-Time Password (Derby Dome)",
            html: mailData
        };
        mailTransporter.sendMail(details, (err) => {
            if (err) {
                return console.log(err.message);
            }
        });
    }

    sendTicket(email: string, gameName: string, time: string,
        date: string, seats: string, price: number, qrCode: string) {

        const mailData = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ticket Booking Details</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="text-align: center;">Ticket Booking Details</h2>
            <p>Dear User,</p>
            <p>Your ticket booking details for "${gameName}" are:</p>
            <div style="padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <p><strong>Match:</strong> ${gameName}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Seats:</strong> ${seats}</p>
                <p><strong>Price:</strong> ₹${price}</p>
            </div>
            <p>Please find your QR code below:</p>
            <img src="cid:unique_qr_code_cid" alt="QR Code" style="display: block; margin: 0 auto; padding: 20px; max-width: 200px;">
            <p>Scan this QR code at the stadium for entry.</p>
            <p>If you have any questions or concerns, feel free to contact us.</p>
            <p>Thank you for booking with us!</p>
            <p>Derby Dome</p>
        </body>
        </html>
    `;

        const base64Image = qrCode;

        let mailTransporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSKEY
            }
        });

        let details = {
            from: process.env.EMAIL,
            to: email,
            subject: "Ticket Booking Success",
            html: mailData,
            attachments: [
                {
                    filename: 'qr_code.png',
                    content: qrCode.split(';base64,').pop(), // Extract base64 content
                    encoding: 'base64',
                    cid: 'unique_qr_code_cid' // CID used in the email HTML img src
                }
            ]
        };
        mailTransporter.sendMail(details, (err) => {
            if (err) {
                return console.log(err.message);
            }
        });
    }
}

export default GenerateEmail;

