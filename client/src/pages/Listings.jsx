import { Filter, Map, Header, PropertyCardList, LoadingSkelton, ErrorComponent } from "../components"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import clsx from "clsx"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { fetchListings } from "../utils/api/listingsApi"

const Listings = () => {

    const [searchParams] = useSearchParams()
    const [view, setView] = useState(null)
    const  {ref, inView} = useInView()
 

    useEffect(() => {
        const handleView = () => {
            if (window.innerWidth <= 1280) {
                setView("list")
            } else {
                setView(null)
            }
        }

        window.addEventListener("resize", handleView)

        handleView()

        return () => {
            window.removeEventListener("resize", handleView)
        }
    }, [])


    const {
        data,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading, 
        isError,
        isSuccess,
        refetch
    } = useInfiniteQuery({
        queryKey: ['listings', searchParams.toString()],
        queryFn: ({ pageParam = 1 }) => fetchListings({ pageParam, searchParams }),
        getNextPageParam: (lastPage) => {
            return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined
        },
      });

    useEffect(() => {
        if (inView && hasNextPage) {
          fetchNextPage();
        }
      }, [inView]);

    const onViewChange = (e) => {
        setView(e.target.id)
    }

    const listings = data?.pages?.flatMap(page => page.listings) || []

    return (
        <>
            <Header />
            <section className={clsx("mt-16 md:mt-20")}>
                <div className="container">
                    <div className="custom-grid overflow-hidden h-[calc(100vh-80px)]" >
                        <div className="filter-area py-3 xl:mr-12 border-b border-b-gray-300">
                            <Filter />
                        </div>

                        <div className={clsx("list overflow-y-auto h-[calc(100vh-170px)] custom-scrollbar", view === "map" && "hidden")}>
                            {isLoading && <LoadingSkelton count={3} />}
                            {isError && <ErrorComponent retryFn={refetch} />}
                            {isSuccess && (
                                <>
                                    <PropertyCardList listings={listings} />
                                    <div ref={ref} className="h-5 invisible">
                                        {isFetchingNextPage
                                            ? <LoadingSkelton count={2} />
                                            : ''}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className={clsx("map", view === "map" || view === null ? "block h-screen" : "hidden")}>
                            <Map listings={listings} />
                        </div>
                    </div>

                    <div className="flex xl:hidden bg-white shadow-2xl ring-1 rounded-full fixed bottom-0 md:bottom-8 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center z-[40000]">
                        <button id="list" className={clsx("w-1/2 py-3 md:py-5 px-6 md:px-9 max-md:text-xs min-w-max rounded-full font-medium", view === "list" && "bg-black text-white")} onClick={onViewChange}>List View</button>
                        <button id="map" className={clsx("w-1/2 py-3 md:py-5 px-6 md:px-9 max-md:text-xs min-w-max rounded-full font-medium", view === "map" && "bg-black text-white")} onClick={onViewChange} >Map View</button>
                    </div>
                </div>
            </section>
        </>

    )
}

export default Listings