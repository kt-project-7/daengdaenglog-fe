import api from './axios'

interface SignInRequest {
  phoneNumber: string
  password: string
}

interface SignInResult {
  userName: string
  imageUri: string
}

interface SignInResponse {
  isSuccess: boolean
  code: string
  message: string
  results: SignInResult
}

export const signIn = async (
  data: SignInRequest,
): Promise<{ accessToken: string; user: SignInResult }> => {
  const response = await api.post<SignInResponse>('/auth/sign-in', data)

  const accessToken = response.headers.authorization
  const user = response.data.results

  return { accessToken, user }
}
