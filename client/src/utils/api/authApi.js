import api from "../../lib/api"

const signupOrLoginUser = async (isRegister, data) => {
    try {
        const response = await api.post(
            isRegister ? "/auth/register" : "/auth/login",
            data
        )

        return response.data
    } catch (error) {
        throw error
    }
}

const googleLogin = async (googleResponse) => {
    try {
        const userInfo = await api.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleResponse.access_token}`, {withCredentials : false}, {
            headers: {
                Authorization: `Bearer ${googleResponse.access_token}`,
                Accept: 'application/json',
            },
        }
        )
        const response = await api.post('/auth/google-login', {
            username: userInfo.data.name,
            email: userInfo.data.email,
            profileImage: userInfo.data.picture,
        })
        return response.data
    } catch (error) {
        throw error
    }
}

const logout = async () => {
    try {
        await api.post("/auth/logout")
    } catch (error) {
        throw error
    }
}

export { signupOrLoginUser, googleLogin, logout }