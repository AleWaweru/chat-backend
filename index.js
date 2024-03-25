const express = require('express');
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
const db = require("./models");

//routers
const postRouter = require('./routes/Posts')
app.use("/posts", postRouter);

const commentRouter = require('./routes/Comments')
app.use("/comments", commentRouter);

const usersRouter = require('./routes/Users')
app.use("/auth", usersRouter);

const likesRouter = require('./routes/Likes')
app.use("/likes", likesRouter);

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log("Server running on port 3001");
    });
}).catch((err) =>{
 console.log(err);
});
