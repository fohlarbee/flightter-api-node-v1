import {cleanEnv, str} from 'envalid'

import * as dotenv from 'dotenv'
dotenv.config();




export const env = cleanEnv(process.env, {
    PORT: str(),
})