import 'reflect-metadata';

import { injectable } from "tsyringe";
import { Query } from './generics/RepositoryTypes.js';
import { IUserSessionRepository } from './types/UserSessionTypes.js';
import { UserSessionDocument, UserSessionModel } from './models/UserSessionModel.js';

@injectable()
export class UserSessionRepository implements IUserSessionRepository {


  async findByEmail(email: string): Promise<UserSessionDocument| null> {

     return  await UserSessionModel.findOne({ email }).exec();
  }

    async create(data: UserSessionDocument): Promise<UserSessionDocument> {
      const newUser = new UserSessionModel(data);
      return await newUser.save();
    }
  
    async find(query?: Query): Promise<UserSessionDocument[]> {
      return await UserSessionModel.find(query || {})
        .exec();
    }

    async findByToken(token: string): Promise<UserSessionDocument | null> {
      return await UserSessionModel.findOne({ token }).exec();
    }
  
    async findById(id: string): Promise<UserSessionDocument | null> {
       const users  = await UserSessionModel.findById(id).exec();
       return users; 
    }

    async update(id: string, data: Partial<UserSessionDocument>): Promise<UserSessionDocument | null> {
      return await UserSessionModel.findByIdAndUpdate(id, data, { new: true }).exec();
    }


}