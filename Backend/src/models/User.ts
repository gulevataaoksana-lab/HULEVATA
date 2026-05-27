export interface User {
    id: string;
    name: string;
    password_hash?: string;
    role?: string;
    registeredAt?: string;
}

export interface CreateUserDto {
    id: string;
    name: string;
    password?: string;
    role?: string;
}

export interface UpdateUserDto {
    name: string;
}