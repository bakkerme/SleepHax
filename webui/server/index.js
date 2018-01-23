const Database = require('better-sqlite3');
const r = require('rambda');
const fs = require('fs');
const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
