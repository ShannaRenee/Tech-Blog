const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');


const routes = require('./controllers')

const app = express();
const PORT = process.env.PORT || 3001;


const sess = {
    secret: process.env.SECRET,
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    },
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(routes)


sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    });
});