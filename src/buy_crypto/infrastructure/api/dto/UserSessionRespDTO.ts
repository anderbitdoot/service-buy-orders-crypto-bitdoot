export interface UserSessionRespDTO {
    _id?: string;
    email: string;
    securityLevel: number;
    token: string;
    cellphone?: string;
} 