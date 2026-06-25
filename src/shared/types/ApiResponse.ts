export interface ApiMessage {
    code: string;
    message: string;
}

export interface ApiMeta {
    success: boolean,
    error?: ApiMessage;
    numRecords?: number;
    totalRecords?: number;
}

export interface ApiResponse<T = any> {
    meta: ApiMeta;
    data: T;
}

export class ApiResponseBuilder {
    static success<T>(data: T, totalRecords: number = 1): ApiResponse<T> {
        return {
            meta: {
                success: true,
                numRecords: totalRecords,
                totalRecords: totalRecords,
            },
            data,
        };
    }

    static error(
        mensajes: ApiMessage,
        data: any = []
    ): ApiResponse<any> {
        return {
            meta: {
                success: false,
                error: mensajes
            },
            data,
        };
    }
}