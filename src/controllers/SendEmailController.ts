import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurversUsersRespositories";
import { SurveysRepository } from "../repositories/SurveysRepositories";
import { UsersRepository } from "../repositories/UsersRepositories";
import SendEmailService from "../services/SendEmailService";
import {resolve} from "path";



class SendEmailController{
    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surversUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email})
        if(!user){
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        const survey = await surveysRepository.findOne({id: survey_id});
        if(!survey){
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }
        const npsPath = resolve(
            __dirname,
            "..",
            "views",
            "emails",
            "npsEmail.hbs")

        const surveyUserAlreadyExists = await surversUsersRepository.findOne({
            where: [{user_id:user.id},{value: null}],
            relations: ['user', "survey"]
        })
        console.log("o que deu");
        console.log(surveyUserAlreadyExists);
        
        
        if(surveyUserAlreadyExists){
            await SendEmailService.execute(
                email, 
                survey.title,
                variables,
                npsPath
            );
            return response.status(200).json(surveyUserAlreadyExists);
        }


        const surveyUser = surversUsersRepository.create({
            survey_id: survey_id,
            user_id: user.id
        })

       
        

        await surversUsersRepository.save(surveyUser);
        // --------------------------
        // SEND EMAIL
        // --------------------------
        await SendEmailService.execute(
            email, 
            survey.title,
            variables,
            npsPath
        );


        return response.status(201).json(surveyUser)
    }
}

export {SendEmailController}