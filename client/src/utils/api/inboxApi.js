import api from "../../lib/api";

const fetchChats = async ({ queryKey }) => {
    const userId = queryKey[1]
    try {
        const response = await api.get(`/inbox/chats/${userId}`)
        return response.data?.chats
    } catch (error) {
        console.log(error)
        throw error?.response
    }
}

const fetchChat = async ({ queryKey }) => {
    const chatId = queryKey[1]
    try {
        const response = await api.get(`/inbox/chat/${chatId}`)
        return response.data?.responseChat
    } catch (error) {
        throw error?.response
    }
}

const findOrCreateChat = async ({ listingUser, user }) => {
    const options = {
        params: {
            participants: [user, listingUser],
            user
        }
    }

    try {
        const response = await api.get(`/inbox/find-or-create`, options)
        return response.data.chat._id
    } catch (error) {
        throw error
    }
}

const submitMessage = async ({chatId, message}) => {
    if(!message) return ;
    try {
        const response = await api.post(`/inbox/messages/add/${chatId}`, {message})
        return response.data?.responseChat
    } catch (error) {
        throw error
    }
}


const markChatAsRead = async ({ chatId, userId }) => {
    const response = await axios.post(`/api/chats/${chatId}/read`, { userId });
    return response.data;
};

const markMessagesAsRead = async ({ chatId, userId }) => {
    const response = await axios.post(`/api/chats/${chatId}/messages/read`, { userId });
    return response.data;
};

export { fetchChats, fetchChat, findOrCreateChat, submitMessage, markChatAsRead, markMessagesAsRead }