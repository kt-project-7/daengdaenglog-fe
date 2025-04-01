import api from './axios';
export const signIn = async (data) => {
    const response = await api.post('/auth/sign-in', data);
    const accessToken = response.headers.authorization;
    const user = response.data.results;
    return { accessToken, user };
};
