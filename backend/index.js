const express = require('express')
const connectDB = require("./config/db")
const morgan = require("morgan")


const app = express()

//middlewares
app.use(express.json());

app.use(morgan("tiny"))

//routes 
app.get('/', (req, res)=>{
    res.json("hello nishant")
})


//server configurations
const PORT = process.env.PORT || 3000;
app.listen(PORT, async()=>{
    try{
        await connectDB();
        console.log(`server listening on port ${PORT}`);        
    }
    catch(err){
        console.log(err);
    }
});