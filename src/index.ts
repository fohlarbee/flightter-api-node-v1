import { Request, Response } from "express";
import * as dotenv from 'dotenv'
import { env } from "./lib/env";
import { prismaConnect } from "./db/connect";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./lib/corsOptions";
import { limiter } from "./lib/rateLimiter";
const http = require('node:http');
const express = require('express')

dotenv.config();


const app = express()

app.use(express.json());
app.use(cors(corsOptions))
app.use(helmet());
app.use(limiter)







app.get('/', (req:Request, res:Response) => {
  res.send('Flightter server is running')
})

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
