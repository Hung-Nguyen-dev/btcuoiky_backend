const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AdminRouter = require("./routes/AdminRouter");
const { verifyToken } = require("./middleware/auth");

dbConnect();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Public routes
app.use("/api/admin", AdminRouter);

// Protected routes
app.use("/api/user", UserRouter);
app.use("/api/photo", verifyToken, PhotoRouter);

app.get("/", (request, response) => {
    response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
    console.log("server listening on port 8081");
});
