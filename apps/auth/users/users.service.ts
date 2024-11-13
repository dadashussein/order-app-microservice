import { Injectable } from '@nestjs/common';
import { UsersRepsitory } from './users.repsitory';

@Injectable()
export class UsersService {
  constructor(private  readonly  userRepository: UsersRepsitory) {}

  async  createUser(request){
    await  this.validateCreateUserRequest(request);
    
  }
}
