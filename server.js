const express = require('express');
const sequelize = require('./config/connection')

require('./models');

const routes = require('./controllers')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(routes)


sequelize.sync().then(() => {
    app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    });
});