import { IJwtDecoded } from "../../models/token.interface";

export class AuthenticationUtil {
  static checkTokenExpires(jwtDecoded: IJwtDecoded): boolean {
    if (!jwtDecoded?.exp) {
      return false; // Invalid token or no expiration time
    }
    
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return jwtDecoded.exp > currentTime; // Returns true if token is still valid
  }
}
