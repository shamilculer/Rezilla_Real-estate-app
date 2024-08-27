import { LoadingSkelton, PropertyCardList } from "../"
import { useQuery } from "@tanstack/react-query"
import { fetchListings } from "../../utils/api/listingsApi"
import {ErrorComponent} from "../"

const Properties = () => {

  let num = 8

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ['listings'],
    queryFn: fetchListings,
  })

  return (
    <section className="mt-28">
      <div className="container">
        <div className="flex items-center justify-betweeen max-md:flex-col">
          <div className="lg:w-1/2">
            <h5 className="title-xs">Our Latest Listings</h5>
            <h2 className="text-text-color-2 mt-3 font-semibold">Latest Listed Properties</h2>
            <p className="text-text-color-3 mt-3 w-3/4">Donec porttitor euismod dignissim. Nullam a lacinia ipsum, nec dignissim purus.</p>
          </div>
        </div>
        <div className="mt-7 sm:mt-11">
          {isLoading && <LoadingSkelton count={8} />}
          {isSuccess && <PropertyCardList listings={data.listings} columns={2} />}
          {isError && <ErrorComponent message={error.message} retryFn={refetch} />}
        </div>
      </div>
    </section>
  )
}

export default Properties