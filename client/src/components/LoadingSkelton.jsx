
const LoadingSkelton = ({count}) => {

 const noOfTypes = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div className="grid gap-y-12 gap-x-8 lg:gap-x-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-auto-fit-card">
        {noOfTypes.map(count => (
            <div className="flex max-xl:flex-col gap-y-2 relative max-w-[626px] animate-pulse" key={count}>
            <div className="min-h-60 sm:min-h-72 lg:min-h-[200px] w-full lg:w-[280px] rounded-xl bg-gray-200"></div>
          
            <div className="p-2 sm:p-4 w-full xl:w-[calc(100%-280px)] flex flex-col justify-between">
              <h3 className="h-4 bg-gray-200 rounded-full"></h3>
          
              <ul className="mt-5 space-y-3">
                <li className="w-full h-4 bg-gray-200 rounded-full"></li>
                <li className="w-full h-4 bg-gray-200 rounded-full"></li>
                <li className="w-full h-4 bg-gray-200 rounded-full"></li>
              </ul>
            </div>
          </div>
        ))}
    </div>
  )
}

export default LoadingSkelton