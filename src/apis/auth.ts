import api from './axios'
import type { SignInRequest, SignInResult, SignInResponse } from '@/types/auth'

export const signIn = async (
  data: SignInRequest,
): Promise<{ accessToken: string; user: SignInResult }> => {
  const response = await api.post<SignInResponse>('/auth/sign-in', data)

  const accessToken = response.headers.authorization
  const user = response.data.results

  return { accessToken, user }
}
