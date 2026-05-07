import * as userRepo from '../repositories/userRepository';
export declare function getAllUsers(): Promise<userRepo.User[]>;
export declare function getUserById(id: string): Promise<userRepo.User>;
export declare function createUser(id: string, name: string): Promise<userRepo.User>;
export declare function updateUser(id: string, name: string): Promise<userRepo.User>;
export declare function deleteUser(id: string): Promise<{
    message: string;
}>;
//# sourceMappingURL=userService.d.ts.map