require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");
const middleware = require('./middleware');

app.use(middleware.CORS);

app.use(Express.json());

const controllers = require("./controllers");

app.use("/log", controllers.logController);
app.use("/user", controllers.UserController);

// app.use('/test', (req, res) => {
//     res.send('This is a message from the test endpoint on the server!')
// });

// app.listen(4000, () => {
//     console.log(`[Server]: App is listening on 4000`);
// });

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(4000, () => {
            console.log(`[server]: App is listening on 4000.`);
        });
    })
    .catch((err) => {
        console.log(`[server]: Server crashed. Error = ${err}`);
    });