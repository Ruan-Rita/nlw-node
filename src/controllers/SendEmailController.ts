import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurversUsersRespositories";
import { SurveysRepository } from "../repositories/SurveysRepositories";
import { UsersRepository } from "../repositories/UsersRepositories";
import SendEmailService from "../services/SendEmailService";


class SendEmailController{
    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surversUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email})
        if(!userAlreadyExists){
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const surverAlreadyExists = await surveysRepository.findOne({id: survey_id});
        if(!surverAlreadyExists){
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        const surveyUser = surversUsersRepository.create({
            survey_id: survey_id,
            user_id: userAlreadyExists.id
        })

        await surversUsersRepository.save(surveyUser);
        // --------------------------
        // SEND EMAIL
        // --------------------------
        await SendEmailService.execute(
            email, 
            surverAlreadyExists.title,
            surverAlreadyExists.description
        );


        return response.status(201).json(surveyUser)
    }
}

export {SendEmailController}