import { listing, usersAvatar } from "../../assets"
import { heroBg, heroSvg } from "../../assets"
import SearchBarTab from "../SearchBarTab"

const Hero = () => {
  return (
    <section className="w-full bg-top bg-no-repeat" style={{ backgroundSize: "85%", backgroundImage : `url(${heroSvg})` }}>
      <div className="container">
        <div className="py-6 sm:py-14 flex max-lg:block">
          <div className="w-1/2 max-lg:w-full relative flex flex-col gap-y-3 sm:gap-y-5">
            <h5 className="title-xs">real estate</h5>
            <h1 className="text-text-color-1 font-semibold leading-tight w-3/4">Find a perfect home you love..!</h1>
            <p className="text-text-color-3 max-md:text-sm sm:pr-8">Etiam eget elementum elit. Aenean dignissim dapibus vestibulum. Integer a dolor eu sapien sodales vulputate ac in purus.</p>

            <div className="mt-6">
              <SearchBarTab />
            </div>

          </div>
          <div className="hidden lg:block w-1/2 ps-20 max-xl:p-0">
            <img className="w-[500px]" src={heroBg} alt="" />
          </div>
        </div>
        <div className="w-full max-sm:mt-6 flex max-sm:flex-col justify-center items-center gap-4">
          <div className="w-80 px-10 py-5 bg-white rounded-[50px] shadow-2xl">
            <div className="flex items-center justify-center gap-x-2">
              <img src={usersAvatar} alt="users" className="w-28" />
              <h4 className="font-medium max-md:text-base">72k+ Happy Customers</h4>
            </div>
          </div>
          <div className="w-80 px-10 py-5 bg-white rounded-[50px] shadow-2xl">
            <div className="flex items-center justify-center gap-x-2">
              <img src={listing} alt="users" className="w-12" />
              <h4 className="font-medium max-md:text-base">200+ New Listings Everyday!</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero