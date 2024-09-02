import { useState } from "react"
import {clsx} from "clsx"
import {FiSearch} from "react-icons/fi"
import { useNavigate, createSearchParams } from "react-router-dom"

const SearchBarTab = () => {

  const [searchType, setSearchType] = useState("buy")
  const navigate = useNavigate()

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value)
  }

  const onSearchSubmit = (e) => {
    e.preventDefault()

    const cityname = e.target.cityname.value.toLowerCase()
    const minPrice = e.target.minPrice.value
    const maxPrice = e.target.maxPrice.value

    const options = {
      cityname,
      minPrice,
      maxPrice,
      type : searchType  
    }

    navigate({
      pathname : "/listing",
      search : createSearchParams(options).toString()
    })
  }

  const radioStyles = "w-full h-full flex items-center justify-center border border-gray-400 font-medium hover:bg-primary-colour hover:text-white transition-all cursor-pointer max-md:text-sm"

  return (
    <div >
      <div className='flex'>
        <div className='w-28 h-12 sm:w-36 sm:h-14 bg-white'>
          <input type="radio" name='searchType' id='buy' value="buy" className='hidden' onChange={handleSearchTypeChange} />
          <label checked htmlFor="buy" className={clsx(`${radioStyles} rounded-tl-md`, searchType === "buy" && "bg-primary-colour text-white")}>Buy</label>
        </div>
        <div className='w-28 h-12 sm:w-36 sm:h-14 bg-white'>
          <input type="radio" name='searchType' id='rent' value="rent" className='hidden' onChange={handleSearchTypeChange} />
          <label htmlFor="rent" className={clsx(`${radioStyles} rounded-tr-md`, searchType === "rent" && "bg-primary-colour text-white")}>Rent</label>
        </div>
      </div>
      <div className="w-full">
        <form onSubmit={onSearchSubmit} className="w-full flex max-md:flex-wrap items-center max-md:divide-y sm:divide-x divide-gray-400 border border-gray-400 rounded-b-lg">
          <input className="sm:flex-1 py-4 px-2 outline-none sm:rounded-bl-lg w-full max-md:text-sm" type="text" name="cityname" placeholder="New York" />
          <input
            type="number"
            name="minPrice"
            min={0}
            max={10000000}
            placeholder="Min Price"
            className="w-1/2 sm:w-full sm:flex-1 py-4 px-2 outline-none max-md:text-sm max-md:border-r"
          />
          <input
            type="number"
            name="maxPrice"
            min={0}
            max={10000000}
            placeholder="Max Price"
            className="w-1/2 sm:w-full sm:flex-1 py-4 px-2 outline-none max-md:text-sm"
          />
          <button type="submit" className="sm:flex-[.5] w-full py-2 sm:py-4 flex items-center justify-center bg-primary-colour text-white rounded-b-md sm:rounded-br-md">
            <FiSearch className="text-2xl" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default SearchBarTab