/**
 * 1.logic to starting the express server
 * 2.make a connection to mongodb, and create a admin user at the server boottime(if not already present)
 * 3.i will have to connect to the route layer
 */

const express=require("express");
const app=express();
require('dotenv').config();

const PORT=process.env.PORT || 7777;
console.log(process.env.PORT)
app.listen(PORT,()=>{
    console.log('Server started running on the port num:${PORT}')
})