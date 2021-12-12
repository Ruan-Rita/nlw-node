import express from 'express'
import "./database/index"
import "reflect-metadata";
import { router } from './router';


const app = express();
app.use(express.json())
app.use(router)

app.listen(3333, () => console.log("server is running"))