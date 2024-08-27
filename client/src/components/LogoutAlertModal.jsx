import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { CiLogout } from "react-icons/ci";
import useGlobalStateStore from "../store/store";
import { useMutation } from '@tanstack/react-query';
import { logout } from '../utils/api/authApi';
import { toast } from 'react-toastify';

const LogoutAlertModal = () => {

    const {user, setUser} = useGlobalStateStore((state) => ({
        user : state.user,
        setUser : state.setUser
    }))

    const logoutMutation = useMutation({
      mutationFn : logout,
      onSuccess : () => {
        window.location = "/"
        setUser(null)
      },
      onError : (error) => {
        toast.error("An unexpected error occurred while logging out!")
      }
    })


    const handleLogout = async () => {
      logoutMutation.mutate()
    }
    return (

        <AlertDialog.Root>

        <AlertDialog.Trigger asChild>
        <button className="bg-red-600 text-white py-2 px-7 rounded-md text-sm flex items-center gap-2 max-sm:w-full max-sm:justify-center"><CiLogout className="text-2xl" /> Log out</button>
        </AlertDialog.Trigger>

        <AlertDialog.Portal>

          <AlertDialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[40000] animate-opacity" />
          <AlertDialog.Content className="bg-white rounded-lg fixed top-44 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[520px] z-[50000] shadow-2xl animate-contentShow focus:outline-none p-4 sm:p-10">

            <AlertDialog.Title className="text-base sm:text-xl font-semibold">
                Are you sure you want to log out from this account ?
            </AlertDialog.Title>

            <div className="flex justify-end gap-[25px] mt-10">
              <AlertDialog.Cancel asChild>
                <button className="bg-gray-300 px-3 py-1 max-sm:text-sm sm:px-5 sm:py-2 rounded-md font-medium">
                  Cancel
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 max-sm:text-sm sm:px-5 sm:py-2 rounded-md">
                  Logout
                </button>
              </AlertDialog.Action>

            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

    )
}


export default LogoutAlertModal;