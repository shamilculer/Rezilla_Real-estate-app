import { useState, useEffect, useRef } from "react";
import useGlobalStateStore from "../store/store";
import { AiOutlineSend } from "react-icons/ai";
import { GiConversation } from "react-icons/gi";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchChat, submitMessage } from "../utils/api/inboxApi";
import queryClient from "../lib/queryClient";
import ErrorComponent from "./ErrorComponent";
import { formatTimestamp } from "../utils/formatTimeStamp";
import { toast } from "react-toastify";

function CurrentChatBox({ socket }) {

    const user = useGlobalStateStore((state) => state.user)
    const [newMessage, setNewMessage] = useState("");
    const textareaRef = useRef()
    const formRef = useRef()
    const messageEndRef = useRef()

    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("chat");

    const { data: currentChat, isLoading, isError, refetch } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: fetchChat,
        staleTime : 0,
        enabled: !!chatId
    })


    const messageSubmitMutation = useMutation({
        mutationFn : ({chatId, message}) => submitMessage({chatId, message}),
        onSuccess : (updatedChat) => {
            queryClient.setQueryData(["chat", chatId], updatedChat)
            setNewMessage("");

            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = "auto";
            }

            const { reciever, ...data } = updatedChat

            queryClient.setQueryData(["chats", user._id], (oldChats) => {
                if (!oldChats) return oldChats;
                const chatIndex = oldChats.findIndex(chat => chat._id === updatedChat?.messages[updatedChat.messages.length -1].chat);
                if (chatIndex === -1) return oldChats;
    
                const latestChat = {
                    ...oldChats[chatIndex],
                    lastMessage: updatedChat.lastMessage,
                    updatedAt: new Date().toISOString()
                };
    
                const newChats = oldChats.filter(chat => chat._id !== updatedChat?.messages[updatedChat.messages.length -1].chat);
                return [latestChat, ...newChats];
            });

            socket.emit("sendMessage", {
                recieverId: reciever._id,
                data: data
            })

        },
        onError : (error) => {
            toast.error("Failed to send message. Please try again.")
        }
    })

    useEffect(() => {
        if (chatId && user._id && socket) {
            socket.emit('markMessagesAsRead', { chatId, userId: user._id });

            // Update local query data
            queryClient.setQueryData(['chat', chatId], (prevChat) => {
                if (!prevChat) return prevChat;
                return {
                    ...prevChat,
                    unreadCounts: {
                        ...prevChat.unreadCounts,
                        [user._id]: 0 
                    }
                };
            });

            // Update the chats list query data
            queryClient.setQueryData(["chats", user._id], (oldChats) => {
                if (!oldChats) return oldChats;
                return oldChats.map(chat => {
                    if (chat._id === chatId) {
                        return {
                            ...chat,
                            unreadCounts: {
                                ...chat.unreadCounts,
                                [user._id]: 0
                            }
                        };
                    }
                    return chat;
                });
            });
        }
    }, [chatId, user._id, socket]);


    useEffect(() => {

        socket?.on("recieveMessage", ({recieverId, data}) => {
            queryClient.setQueryData(["chat", chatId], (prev) => {
            socket.emit('markMessagesAsRead', { chatId, userId: user._id });
                return {
                    ...data,
                    reciever: prev.reciever
                }
        })

            queryClient.setQueryData(["chats", user._id], (oldChats) => {
                if (!oldChats) return oldChats;
                const chatIndex = oldChats.findIndex(chat => chat._id === data?.messages[data.messages?.length -1].chat);
                if (chatIndex === -1) return oldChats;
    
                const updatedChat = {
                    ...oldChats[chatIndex],
                    lastMessage: data.lastMessage,
                    updatedAt: new Date().toISOString()
                };
    
                const newChats = oldChats.filter(chat => chat._id !== data?.messages[data.messages.length -1].chat);
                return [updatedChat, ...newChats];
            });
            
        })

        return () => {
            socket?.off("recieveMessage");
        };

    }, [socket, chatId])

    useEffect(() => {
        messageEndRef.current?.scrollIntoView();
    }, [currentChat, chatId ])


    const adjustTextareHeight = (textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }


    const onMessageTextChange = (e) => {
        const textarea = e.target;
        setNewMessage(textarea.value);
        adjustTextareHeight(textarea)
    };


    const onMessageSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const message = formData.get("message");

        if (!message) return;

        messageSubmitMutation.mutate({chatId, message})

    };

    if(isLoading) return (
        <div className="h-[80vh] w-full md:w-2/3 grid place-items-center">
            <div className="bars"></div>
        </div>
    )

    if(isError) return (
        <div className="h-[80vh] max-md:hidden w-2/3 grid place-items-center">
            <ErrorComponent retryFn={refetch} />
        </div>
    )

    return (
        <div className={`w-full lg:w-2/3 ${!currentChat ? "max-sm:hidden" : ""}`}>
            {currentChat ? (
                <div className="w-full h-[80vh] relative">
                    <div className="h-[70px] py-3 px-5 border-b-2 border-gray-300 flex items-center gap-x-3">
                        <div>
                            <img
                                className="size-8 sm:size-10 rounded-full"
                                src={currentChat?.reciever?.profileImage}
                                alt={currentChat?.reciever?.username}
                            />
                        </div>

                        <div className="flex flex-col">
                            <h4 className="max-sm:text-sm font-semibold">{currentChat?.reciever?.username}</h4>
                            <span className="text-[8px] sm:text-xs">{currentChat?.reciever?.email}</span>
                        </div>
                    </div>


                    <div style={{ height: `calc(100% - ${70 + (formRef.current?.clientHeight || 0)}px)` }} className="overflow-y-auto overflow-x-hidden custom-scrollbar px-4 flex flex-col">
                        {currentChat?.messages?.map((message, index) => {
                            console.log(message.sender)
                            return (
                                <div key={index} className={`w-full my-[10px] first-of-type:mt-6 last-of-type:mb-6 flex ${message.sender !== currentChat.reciever._id && "justify-end"}`}>
                                    <div className={`w-auto max-w-[70%] px-4 sm:px-6 py-1 sm:py-2 max-sm:text-sm rounded-md bg-opacity-65 overflow-hidden text-sm flex flex-col ${message.sender === currentChat.reciever._id ? "bg-gray-200" : "bg-cyan-100"}`}>
                                        {message.message}
                                    <span className="text-[7px] sm:text-[10px] font-medium ml-auto">{formatTimestamp(message.createdAt)}</span>
                                    </div>
                                </div>
                            )

                        })}
                        <div ref={messageEndRef}></div>
                    </div>


                    <form
                        ref={formRef}
                        onSubmit={onMessageSubmit}
                        className="absolute bottom-0 py-4 px-4 w-full border-t-2 border-gray-300 flex items-end gap-4 bg-white"
                    >
                        <textarea
                            onChange={onMessageTextChange}
                            ref={textareaRef}
                            name="message"
                            id="message"
                            placeholder="Write your message..."
                            value={newMessage}
                            style={{ height: "auto" }}
                            rows={1}
                            className="resize-none min-h-10 w-[85%] overflow-hidden border border-gray-500 text-sm rounded py-2 px-[11px]"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage || messageSubmitMutation.isPending}
                            className="h-10 min-h-10 bg-color1 w-[15%] text-white font-medium text-sm rounded flex items-center justify-center gap-3 disabled:bg-gray-300 max-sm:text-[0px]"
                        >
                            {messageSubmitMutation.isPending ? "Sending..." : "Send"} <AiOutlineSend className="text-lg" />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="max-md:hidden h-[80vh] w-full flex flex-col items-center justify-center gap-5">
                    <div className="text-center text-xl font-medium text-gray-700">
                        <GiConversation className="text-7xl" />
                    </div>
                    <div>
                        <div className="text-center text-xl font-medium text-gray-700">
                            Select a conversation to start messaging.
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            Click on a chat from the inbox.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CurrentChatBox;
