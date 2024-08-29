import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { IoCloseCircleOutline } from "react-icons/io5";
import { BiFilterAlt } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMinMaxPrice } from '../utils/api/listingsApi';

const Filter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQueryValues = {
    cityname: searchParams.get('cityname')?.toLowerCase() || "",
    type: searchParams.get('type') || "any",
    minPrice: searchParams.get('minPrice') || "",
    maxPrice: searchParams.get('maxPrice') || "",
    bedrooms: searchParams.get('bedrooms') || "any",
    bathrooms: searchParams.get('bathrooms') || "any",
    amenities: searchParams.get('amenities') || ""
  };
  const [queryValues, setQueryValues] = useState(initialQueryValues);
  const [price, setPrice] = useState([0, 1000000]); // Default min and max values
  const [amenities, setAmenities] = useState(initialQueryValues.amenities.split(',').filter(Boolean));

  const { data: minMaxPrices, isSuccess } = useQuery({
    queryKey: ['minMaxPrices'],
    queryFn: fetchMinMaxPrice,
  });

  useEffect(() => {
    if (isSuccess && minMaxPrices) {
      setPrice([
        Number(queryValues.minPrice) || minMaxPrices.min,
        Number(queryValues.maxPrice) || minMaxPrices.max
      ]);
    }
  }, [isSuccess, minMaxPrices, queryValues.minPrice, queryValues.maxPrice]);

  const handleSliderChange = (newPrice) => {
    setPrice(newPrice);
    setQueryValues({
      ...queryValues,
      minPrice: newPrice[0],
      maxPrice: newPrice[1]
    });
  };

  const handlePriceInputChange = (e, index) => {
    const newPrice = Number(e.target.value);
    const newPrices = [...price];
    newPrices[index] = newPrice;
    setPrice(newPrices);
    setQueryValues({
      ...queryValues,
      minPrice: newPrices[0],
      maxPrice: newPrices[1]
    });
  };

  const handleAmenities = (e) => {
    const existingAmenities = [...amenities];
    if (existingAmenities.includes(e.target.name)) {
      existingAmenities.splice(existingAmenities.indexOf(e.target.name), 1);
    } else {
      existingAmenities.push(e.target.name);
    }
    setAmenities(existingAmenities);
  };

  const handleFilterChange = () => {
    queryValues.amenities = amenities.join(",");
    setSearchParams(queryValues);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center max-xl:justify-between gap-10">
        <div className="w-[70%]">
          <label className="text-sm font-semibold text-text-color-2" htmlFor="location">Location</label>
          <div className="flex items-center gap-x-2 md:gap-x-5">
            <input 
              className="max-md:w-full max-w-96 md:min-w-96 xl:w-full h-8 p-2 border border-text-color-4 rounded-lg" 
              type="text" 
              id="location" 
              name="location" 
              onChange={(e) => setQueryValues((values) => ({...values, cityname: e.target.value?.toLowerCase()}))}
              defaultValue={queryValues.cityname}
            />
            <button onClick={handleFilterChange} className="bg-primary-colour h-10 w-14 flex items-center justify-center text-white rounded-full">
              <FiSearch className="text-base" />
            </button>
          </div>
        </div>

        <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
          <Dialog.Trigger asChild>
            <button className="mt-6 border border-gray-600 rounded-md py-1 md:py-2 px-2 md:px-4 flex items-center text-sm font-medium gap-2">
              <BiFilterAlt className="text-2xl" /> <span className='max-md:hidden'>Filter</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-[rgba(0,0,0,.3)] z-[40000] animate-opacity" />
            <Dialog.Content className="bg-white rounded-lg fixed sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 max-sm:bottom-0 sm:-translate-y-1/2 w-screen sm:max-w-[850px] z-[50000] shadow-2xl max-sm:animate-toTop sm:animate-contentShow focus:outline-none">
              <div className='p-3 sm:p-5 border-b'>
                <Dialog.Title className="text-base sm:text-lg text-center font-medium">Filters</Dialog.Title>
              </div>

              <div className="px-3 sm:px-14 max-h-[68vh] overflow-y-scroll">
                {/* Type selection */}
                <div className='py-8 sm:py-10 border-b border-b-[#b5b5b5]'>
                  <h4 className='font-semibold'>Choose Your Type</h4>
                  <p className='text-xs sm:text-sm text-text-color-3'>Search rooms, entire homes or any type of place</p>
                  <RadioGroup.Root
                    className="mt-5 grid grid-cols-3"
                    defaultValue={queryValues.type}
                    onValueChange={(value) => setQueryValues(prevQuery => ({ ...prevQuery, type: value }))}
                  >
                    {['any', 'rent', 'buy'].map((type) => (
                      <div key={type} className="h-12 sm:h-14">
                        <RadioGroup.Item
                          className="filter-radio w-full h-full flex items-center justify-center border border-gray-400 font-medium hover:bg-primary-colour hover:text-white transition-all cursor-pointer rounded-l-2xl max-sm:text-sm"
                          value={type}
                          id={type}
                        >
                          {type === 'any' ? 'Any' : type === 'rent' ? 'For Rent' : 'For Sale'}
                        </RadioGroup.Item>
                      </div>
                    ))}
                  </RadioGroup.Root>
                </div>

                {/* Price Range */}
                <div className='py-8 sm:py-10 border-b border-b-[#b5b5b5]'>
                  <h4 className='font-semibold'>Price Range</h4>
                  <p className='text-xs sm:text-sm text-text-color-3'>Search rooms, entire homes or any type of place</p>
                  <div className="mt-5 sm:mt-7">
                    {isSuccess && minMaxPrices ? (
                      <Slider.Root
                        className="w-full relative flex items-center select-none touch-none h-5"
                        value={price}
                        max={minMaxPrices.max}
                        min={minMaxPrices.min}
                        onValueChange={handleSliderChange}
                      >
                        <Slider.Track className="bg-gray-400 relative grow rounded-full h-3">
                          <Slider.Range className="bg-primary-colour absolute rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block size-7 border-2 border-primabg-primary-colour bg-white rounded-full shadow-2xl cursor-pointer" aria-label="Volume" />
                        <Slider.Thumb className="block size-7 border-2 border-primabg-primary-colour bg-white rounded-full shadow-2xl cursor-pointer" aria-label="Volume" />
                      </Slider.Root>
                    ) : (
                      <p>Loading price range...</p>
                    )}
                    <div className="grid grid-cols-2 gap-8 sm:gap-16 mt-4 sm:mt-6">
                      <div>
                        <label className='text-xs sm:text-sm text-text-color-3' htmlFor="min">Minimum</label>
                        <input
                          placeholder="$0"
                          className="h-8 w-full rounded border border-gray-400 px-3"
                          value={price[0]}
                          type="number"
                          name="min"
                          id="min"
                          onChange={(e) => handlePriceInputChange(e, 0)}
                        />
                      </div>
                      <div>
                        <label className='text-xs sm:text-sm text-text-color-3' htmlFor="to">Maximum</label>
                        <input
                          placeholder="$50000"
                          className="h-8 w-full rounded border border-gray-400 px-3"
                          type="number"
                          name="max"
                          id="max"
                          value={price[1]}
                          onChange={(e) => handlePriceInputChange(e, 1)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bedrooms and Bathrooms */}
                <div className='py-8 sm:py-10 border-b border-b-[#b5b5b5]'>
                  <h4 className='font-semibold'>Bedrooms and Bathrooms</h4>
                  <div className="mt-7 max-sm:flex max-sm:justify-around">
                    {['bedrooms', 'bathrooms'].map((type) => (
                      <div key={type} className='my-0 sm:my-7 flex items-center max-sm:flex-col gap-6 sm:gap-14'>
                        <span className='text-text-color-3 max-sm:text-sm'>Minimum {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <RadioGroup.Root
                          className="flex items-center max-sm:flex-col gap-6"
                          defaultValue={queryValues[type]}
                          onValueChange={(value) => setQueryValues(prevQuery => ({ ...prevQuery, [type]: value }))}
                        >
                          {['any', '1', '2', '3', '4'].map((value) => (
                            <div key={value}>
                              <RadioGroup.Item
                                className="filter-radio py-3 px-6 rounded-3xl border border-gray-600 font-medium text-sm"
                                value={value}
                                id={`${type}-${value}`}
                              >
                                {value}
                              </RadioGroup.Item>
                            </div>
                          ))}
                        </RadioGroup.Root>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className='py-8 sm:py-10'>
                  <h4 className='font-semibold'>Amenities</h4>
                  <div className="mt-5 sm:mt-7">
                    <div className="px-4 grid sm:grid-cols-2 gap-6">
                      {[
                        'parking', 'outdoor-space', 'pool', 'fireplace',
                        'heating-cooling', 'pet-friendly', 'office-space', 'alarm-system'
                      ].map((amenity) => (
                        <label key={amenity} className='flex items-center gap-3 cursor-pointer max-sm:text-sm' htmlFor={amenity}>
                          <input
                            onChange={handleAmenities}
                            type="checkbox"
                            checked={amenities.includes(amenity)}
                            name={amenity}
                            id={amenity}
                            className='h-5 w-5 rounded-md'
                          />
                          {amenity.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-3 sm:p-5 border-t w-full'>
                <div className="flex items-center justify-end">
                  <button onClick={handleFilterChange} className='btn-primary'>Save Changes</button>
                </div>
              </div>

              <Dialog.Close asChild>
                <button className="IconButton size-6 sm:size-8 inline-flex items-center justify-center absolute top-4 right-4" aria-label="Close">
                  <IoCloseCircleOutline className='text-3xl' />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Filter;