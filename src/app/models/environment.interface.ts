import { FirebaseOptions } from "firebase/app";

export interface IEnvironment {
  backendApi: string;
  backendStatic: string;
  socket: string;
  firebase: FirebaseOptions;
}