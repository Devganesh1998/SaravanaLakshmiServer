/* tslint:disable */
export interface Response {
    send: Function;
    json: Function;
    status: Function;
    end: Function;
    sendFile: Function;
    cookie: Function;
    clearCookie: Function;
    sendStatus: Function;
}

export interface Request {
    cookies: {
        saraLak: string;
    };
    params: any;
    path: string;
    query: Object;
    body: any;
    get: Function;
    user?: {
        email?: string;
        phoneNo?: string;
        isAdmin: boolean;
        id: string;
    };
}

export interface Product {
    id?: string;
    name: string;
    type: string;
    status: string;
    imgSrc: string;
    quantity: number;
    price: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
}

export interface User {
    id?: string;
    status: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    password: string;
    email: string;
    phoneNo: number;
    createdBy?: string;
    isAdmin?: boolean;
}
