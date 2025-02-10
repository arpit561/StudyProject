// run command, npm init -y, npm i express dotenv cookie-parser mongoose jsonwebtoken
//  nodemailer otp-generator bcrypt razorpay cors express-fileupload cloudinary crypto-random-string

// diceBear-website -> used for image icon
// crypto.randomUUID() -> used to generate random number/token
// learn -> cron job


const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute= require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // to link frontend with backend
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
// const { sendotp } = require("./controllers/Auth");
dotenv.config();

const PORT = process.env.PORT || 4000;

// Database connect
database.connect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET,POST,PUT,DELETE"],
    credentials: true,
  })
);


app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
)


// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);



// default route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running..."
    })
})

app.listen(PORT, () => {
    console.log(`App is running at port no ${PORT}`);
})
