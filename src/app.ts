import express from 'express'
import createConnection from "./database/index"
import "reflect-metadata";
import { router } from './router';

createConnection();
const app = express();
app.use(express.json())
app.use(router)

export {app}