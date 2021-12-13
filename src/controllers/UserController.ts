// interface 
import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepositories';
class UserController{
    async create(Request: Request, Response: Response){
        const {name, email} = Request.body;

        const userRepositorie = getCustomRepository(UsersRepository);
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


        return Response.status(201).json(user);
    }
}

export {
    UserController
};
