export interface ISendOTP {
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVerifyOTP {
  email: string;
  otp: string;
}
