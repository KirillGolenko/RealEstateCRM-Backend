import { createParamDecorator } from "@nestjs/common";
import User from "src/users/entities/users.entity";

export const GetOneUser = createParamDecorator((req): User => req.user);
