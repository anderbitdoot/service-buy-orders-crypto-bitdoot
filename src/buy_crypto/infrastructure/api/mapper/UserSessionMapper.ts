import { UserSessionDocument} from "../../repository/models/UserSessionModel";
import { StepMapper } from './StepMapper';
import { UserSessionDTO } from '../dto/UserSessionDTO';
import { StepDocument} from "../../repository/models/StepModel";
import { UserSessionRespDTO } from '../dto/UserSessionRespDTO';

export class UserSessionMapper {

    static toDTO(userSession: UserSessionDocument): UserSessionDTO {
        return {
            _id: userSession._id?.toString(),
            email: userSession.email,
            securityLevel: userSession.securityLevel,
            token: userSession.token,
            password: userSession.password,
            steps: userSession.steps?.map(step => StepMapper.toDTO(step))
        };
    };

    static toDocument(userSession: UserSessionDTO): Partial<UserSessionDocument> {
        return {
            email: userSession.email,
            password: userSession.password,
            securityLevel: userSession.securityLevel,
            token: userSession.token,
            steps: userSession.steps?.map(step => StepMapper.toDocument(step) as StepDocument)
        };
    }

    static mapToUserSessionRespDTO(userSessionDTO: UserSessionDTO): UserSessionRespDTO {
        return {
            email: userSessionDTO.email,
            securityLevel: userSessionDTO.securityLevel,
            token: userSessionDTO.token,
            cellphone: userSessionDTO.cellphone,
            // steps: userSessionDTO.steps
        };
    }

    static toDTOArray(states: UserSessionDocument[]): UserSessionDTO[] {
        return states.map(this.toDTO);
    }
}