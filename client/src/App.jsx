import { Layout, PrivateRoutes, ScrollRestoration } from "./components"
import { Home, SignUp, NotFound, AddListing, Login, Listings, SingleProperty, Wishlist, Profile, Inbox } from "./pages"
import { Routes, Route } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "./lib/queryClient"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative overflow-x-hidden">
        <main>
          <ScrollRestoration>
          <Routes>
            <Route element={<Layout />} >
              <Route index element={<Home />} />
              <Route path="/listing/:id" element={<SingleProperty />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<PrivateRoutes />} >
              <Route path="/listing/new" element={<AddListing />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/inbox" element={<Inbox />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listing" element={<Listings />} />
          </Routes>
          </ScrollRestoration>
        </main>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        pauseOnHover={false}
        theme="colored"
      />
    </QueryClientProvider>

  )
}

export default App