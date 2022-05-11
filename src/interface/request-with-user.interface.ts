import { Request } from 'express';

import User from 'src/users/entities/users.entity';

export default interface RequestWithUser extends Request {
  user: User;
}
