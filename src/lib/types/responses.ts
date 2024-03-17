export interface JwtAuthenticationResponse {
  authToken: string;
  email: string;
  error: string;
  httpStatus: string;
  errorCode: number;
}