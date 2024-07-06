import { Request, Response } from "express";
import * as dotenv from 'dotenv'
import { env } from "./lib/env";
import { prismaConnect } from "./db/connect";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./lib/corsOptions";
import { limiter } from "./lib/rateLimiter";
import  authRouter  from "./routers/auth";
import { userRouter } from "./routers/user";
// const http = require('node:http');
import express from 'express'
import * as cron from 'node-cron';
import axios from "axios";

dotenv.config();


const app = express()

app.use(express.json());
app.use(helmet());
app.use(limiter)


//endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter)
app.use(cors(corsOptions))




cron.schedule("*/10 * * * *", async() => {
  
      await axios.get('https://https://flightter-api-node-v1.onrender.com/ping').then((response) => console.log(`server pinged ${response}`)).catch((error) => console.log(error))
  
})



app.get('/', (req:Request, res:Response) => {
  res.send('Flightter server is running')
});

async function init(){
   await prismaConnect();
    const server = app.listen(process.env.PORT || env.PORT , () => {
        console.log(`Server now live`)
      })
      process.on('SIGINT', () => {
        server.close(() => {
          console.log('Server closed');
        });
      });
    
      
}

 init();
