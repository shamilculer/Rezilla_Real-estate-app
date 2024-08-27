import useGlobalStateStore from "../store/store"
import { io } from "socket.io-client"
import { Link, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { clsx } from "clsx"
import { CurrentChatBox, ErrorComponent, Header } from "../components";
import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "../utils/api/inboxApi";
import { formatTimestamp } from "../utils/formatTimeStamp";

const Inbox = () => {
    const user = useGlobalStateStore((state) => state.user)
    const [searchParams] = useSearchParams()
    const chatId = searchParams.get('chat')

    const [socket, setSocket] = useState(null)

    const { data: chats, isLoading, isError, refetch } = useQuery({
        queryKey: ["chats", user._id],
        queryFn: fetchChats,
        enabled: !!user._id,
        staleTime: 0
    })

    useEffect(() => {
        const socketInstance = io("http://localhost:3000");
        setSocket(socketInstance);
        socketInstance.emit("newUser", user._id);

        return () => {
            socketInstance.close();
        };
    }, [user._id]);



    if (isLoading) return (
        <div className="container flex items-center justify-center">
            <div className="bars"></div>
        </div>
    )

    if (isError) return <ErrorComponent retryFn={refetch} />

    return (
        <>
            <Header />
            <section className="mt-14 md:mt-20">
                <div className="container">
                    <div className="py-10">
                        {chats.length > 0 ? (
                            <div className='w-full xl:w-[90%] bg-white divide-x divide-text-color-3 flex border border-gray-300 mx-auto overflow-hidden'>
                                <div className={clsx(`w-full lg:w-1/3 h-[90vh] md:h-[78vh] md:overflow-y-scroll custom-scrollbar`, chatId && "max-sm:hidden")}>
                                    {
                                        chats?.map(chat => {
                                            return (
                                                <Link key={chat?._id} to={`/inbox?chat=${chat?._id}`} className={clsx('flex items-center gap-x-3 p-5 border-b border-gray-300 relative border-l-primary-colour hover:border-l-[5px] cursor-pointer', chatId === chat?._id && "border-l-[5px]")}>
                                                    <div className="w-9 md:w-[15%]">
                                                        <img className="size-full rounded-full border border-gray-400" src={chat?.messager?.profileImage} alt={chat?.messager?.username} />
                                                    </div>
                                                    <div className="w-[85%]">
                                                        <h5 className="font-semibold max-lg:text-sm">{chat?.messager?.username}</h5>
                                                        <span className="text-xs italic line-clamp-1">{chat?.lastMessage?.message.substring(0, 40)}...</span>
                                                        <div className="absolute top-5 right-4 text-xs text-color-3 font-medium">{formatTimestamp(chat.updatedAt)}</div>
                                                    </div>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                                <CurrentChatBox socket={socket} />
                            </div>
                        ) : (
                            <div className="h-[50vh] w-full flex flex-col items-center gap-4 justify-center text-text-color-3 text-3xl">
                                <span>No chats found</span>
                                <Link to="/listing" className="btn-primary">View properties</Link>
                            </div>
                        )}

                    </div>
                </div>
            </section>
        </>
    )
}

export default Inbox