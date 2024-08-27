import { Outlet, Navigate } from "react-router-dom"
import useGlobalStateStore from "../store/store"
import Header from "./Header"
import Footer from "./Footer"

const PrivateRoutes = () => {
  const user = useGlobalStateStore((state) => state.user)

  return (
    user ? (
      <>
        <Header />
          <Outlet />
        <Footer />
      </>
    ) : (
      <Navigate to="/register" />
    )
  )
}

export default PrivateRoutes