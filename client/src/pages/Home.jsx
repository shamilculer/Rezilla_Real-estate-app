import { Hero, Properties } from '../components'
import { introImg, introIcon1, introIcon2, round, roundTxt, homePng } from '../assets'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='mt-20' >
      <Hero />

      <section className='mt-36'>
        <div style={{minHeight : "0"}} className="container">
          <div className="flex max-lg:flex-col-reverse gap-5">
            <div className='w-full lg:w-[45%] flex flex-col gap-y-5'>
              <h5 className="title-xs">WHO ARE WE</h5>
              <h2 className="text-text-color-2 font-semibold leading-tight">Assisting individuals in locating the appropriate real estate.</h2>
              <p className="text-text-color-3 max-md:text-sm">Donec porttitor euismod dignissim. Nullam a lacinia ipsum, nec dignissim purus. Nulla convallis ipsum molestie nibh malesuada, ac malesuada leo volutpat.</p>
              <div className='mt-8 sm:pl-6 flex max-md:block lg:block'>
                <div className='md:px-8 flex items-center gap-x-6'>
                  <img src={introIcon1} alt="smart home" />
                  <div>
                    <h5 className='text-color1 font-medium'>Donec porttitor euismod</h5>
                    <p className='text-text-color-3 text-sm'>Nullam a lacinia ipsum, nec  dignissim purus. <br /> Nulla a lacinia ipsum, nec</p>
                  </div>
                </div>
                <div className='max-md:mt-12 lg:mt-12 md:px-8 flex items-center gap-x-6'>
                  <img src={introIcon2} alt="smart home" />
                  <div>
                    <h5 className='text-color1 font-medium'>Donec porttitor euismod</h5>
                    <p className='text-text-color-3 text-sm'>Nullam a lacinia ipsum, nec  dignissim purus. <br /> Nulla a lacinia ipsum, nec</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full lg:w-[55%] relative flex flex-col lg:items-end'>
              <img src={roundTxt} alt="Round Text" className='absolute w-44 right-60 -top-14 animate-spin-slow' />
              <img src={introImg} alt="Rezilla" />
              <img src={round} alt="round" className='absolute w-14 bottom-16 right-44 rotate-[30]' />
            </div>

          </div>
        </div>
      </section>

      <Properties />

      <section className='mt-24 md:mt-48 mb-12 md:mb-36'>
        <div style={{minHeight : "0"}} className="container">
          <div className='w-full min-h-64 bg-primary-colour rounded-3xl relative px-5 md:px-12  flex items-center xl:justify-center'>
            <img src={round} alt="ellipse" className="absolute right-10 sm:right-28 rotate-90 w-20 sm:w-28" />
            <img src={homePng} alt="House" className="max-xl:hidden absolute -bottom-3 -left-8 w-[502px]" />
            <div className="xl:ml-64 flex max-md:flex-col items-start lg:items-center  gap-12">
              <div>
                <h2 className="text-white font-semibold">Buy Your New Home</h2>
                <p className="text-text-color-5 text-sm w-96 mt-3">Fusce venenatis tellus a felis scelerisque. venenatis tellus a felis scelerisque.</p>
              </div>
              <Link to="/listing" className="btn-primary-white">View Listings</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home