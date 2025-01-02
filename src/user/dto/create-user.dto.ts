import { UserRole } from "../enums/UserRole";

export class CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
  name?: string;
  status?: boolean;
  branchId: string;
}
