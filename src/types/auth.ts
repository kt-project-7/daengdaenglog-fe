export interface SignInRequest {
  phoneNumber: string
  password: string
}

export interface SignInResult {
  userName: string
  imageUri: string
}

export interface SignInResponse {
  isSuccess: boolean
  code: string
  message: string
  results: SignInResult
}
