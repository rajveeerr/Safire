export interface User {
    id: string;
    email: string;
    name: string;
}
  
export interface JwtPayload {
    sub: string;
    email: string;
    exp: number;
}