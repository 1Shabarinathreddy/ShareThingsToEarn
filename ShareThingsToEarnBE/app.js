const express = require('express');
const app = express();
const bodyParser = require('body-parser');

try {
    const port = 3000
const routeHandler = require('./routes/index')
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello ShareThingstoEarn')
})

app.use('/', routeHandler)

app.listen(port, () => {
    console.log(`Server listening at port ${port}`)
})
} catch (error) {
    console.log(error)
}
