import { QueryClient } from "@tanstack/react-query";
import useGlobalStateStore from "../store/store";

const globalStateStore = useGlobalStateStore.getState()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 *5,
            retry : (failureCount, error) => {
                if(error && error?.status === 401){
                    window.location = "/register"
                    globalStateStore.setUser(null)
                    return false;
                }
                return failureCount < 3;
            }
        },
        mutations : {
            retry : 0
        }
    },
})

export default queryClient;