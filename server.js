const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()

app.use(morgan(':method :url :response-time'))
app.use(express.static(path.join(__dirname, '/cliente')));

app.get('/prueba', (req, res) => {
	res.status(200).send([{url: 'sss', title: 'sss'}, {url: 'ddd', title: 'ddd'}, {url: 'rr', title: 'rrr'}])
})


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/cliente' , 'index.html'));
});



app.listen(3000)