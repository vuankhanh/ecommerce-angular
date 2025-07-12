import { AuthenticationProvider, UserRole } from "../sharing/constant/user.constant";
import { IMongodbDocument } from "./mongo.interface";

export interface IUserInformation {
  email: string;
  emailVerified: boolean;
  hasPassword: boolean;
  password?: string;
  googleId?: string;
  facebookId?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  name: string;
  avatar?: string;
  role: `${UserRole}`
  createdByProvider: `${AuthenticationProvider}`;
}

export type TUserInformationModel = IUserInformation & IMongodbDocument;