const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
require('dotenv').config();

app.listen(port,()=>{
    console.log('listening to port=>',port);
})
app.get('/',(req,res)=>{
    res.send('server');
})