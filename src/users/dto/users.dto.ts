// users/dto/user.dto.ts
export class UsersDto {
  email: string;
  user_id: string;
  onboarded_by : string;
  isValidate :{type :boolean,default:true};
}
