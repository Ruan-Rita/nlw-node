// interface 
import {Request, Response } from 'express' 
import { getRepository } from 'typeorm';
import { User } from '../models/User';
class UserController{
    async create(Request: Request, Response: Response){
        const {name, email} = Request.body;

        const userRepositorie = getRepository(User);
        const userAlreadyExists = await userRepositorie.findOne({
            email
        })
        if(userAlreadyExists){
            return Response.status(400).json({
                error: "User already exists!"
            })
        }
        const user = userRepositorie.create({
            name,
            email
        })
        await userRepositorie.save(user)


        return Response.json(user);
    }
}

export{
    UserController
}