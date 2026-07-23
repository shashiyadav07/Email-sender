import express from "express";
import nodemailer from 'nodemailer'
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transport = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
   auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
})
const upload = multer({
    dest: "uploads/"
});

app.get("/", (req, res) => {
    res.render("index");
});
app.post("/send", upload.single("attachment"), async (req, res) => {
//     console.log(req.file);
// console.log(req.body);
    const { email, subject, message } = req.body;
    const mailOptions = {
   from: `"Savak Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: message
};

if (req.file) {
    mailOptions.attachments = [
        {
            filename: req.file.originalname,
            path: req.file.path
        }
    ];
}
    try {
       const info = await transport.sendMail(mailOptions);

console.log(info);

res.send("Email Sent Successfully");
    } catch (error) {
         console.log(error);
        res.send("Failed to send email");
    }

  
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});