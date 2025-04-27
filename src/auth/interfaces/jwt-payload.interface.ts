export interface JwtPayload {
  sub: string; // user id
  email: string;
  userCategory: string;
  iat?: number; // issued at
  exp?: number; // expiration time
}

