export const SET_AUTH = 'SET_AUTH';

export function setAuth(email, role, token) {
    return  {
        type : SET_AUTH,
        email : email,
        role : role,
        lastAuth : new Date(),
        token : token
    }
}