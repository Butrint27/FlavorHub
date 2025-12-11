export interface JwtPayload {
  sub: number;
  email: string;
  fullName: string;
  iat?: number;
  exp?: number;
}
