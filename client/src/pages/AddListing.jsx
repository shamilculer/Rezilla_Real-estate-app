import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef, useState, useEffect } from "react";
import listingSchema from "../utils/listingSchema";
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import useGlobalStateStore from "../store/store";
import Dropzone from "react-dropzone";
import { IoClose } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { addNewListing, fetchLatlon } from "../utils/api/listingsApi";
import queryClient from "../lib/queryClient";


const AddListing = () => {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [coordinates, setCoordinates] = useState({ lat: "", long: "" })
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting }, setError } = useForm({ resolver: yupResolver(listingSchema) })
  const user = useGlobalStateStore(state => state.user)
  const timeoutRef = useRef(null)

  const latlonMutation = useMutation({
    mutationFn : (params) => fetchLatlon(params),
    onSuccess : (location) => {
      setCoordinates({
        lat: location.lat,
        long: location.lon,
      });
    },
    onError : (error) => {
      toast.error("Failed to fetch coordinates")
      console.log(error)
    }
  })

  const newListingMutation = useMutation({
    mutationFn : (data) => addNewListing(data),
    onSuccess : (listing) => {
      queryClient.setQueryData(["listing", listing._id], listing)
      navigate(`/listing/${listing._id}`)
    },
    onError : (error) => {
      console.log(error)
      toast.error("Failed to add new listing")
    }
  })

  const onAddressChange = async (e) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (e.target.value.length > 2) {
      timeoutRef.current = setTimeout(async () => {
        latlonMutation.mutate({
          q: e.target.value,
          format: 'json',
        })
      }, 2500)
    }
  }


  const onNewListingSubmit = async (data) => {
    if (images.length < 1) {
      return toast.error("Please upload at least one image");
    }

    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    for (const image of images) {
      formData.append('images', image);
    }

    formData.append('user', user._id);

    newListingMutation.mutate(formData);
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'lat' || name === 'long') {
        setCoordinates(prev => ({ ...prev, [name]: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <section>
      <div className="container py-12 mt-12 md:mt-20">
        <h2 className="font-medium pb-3 border-b">Add New</h2>
        <div className="flex max-lg:flex-col-reverse gap-10 md:gap-20 py-8">
          <div className="w-full lg:w-3/5">
            <form className="flex flex-wrap items-center gap-6" onSubmit={handleSubmit(onNewListingSubmit)} >

              <label htmlFor="title" className="flex flex-col font-medium w-full sm:w-[100%]">
                Title
                <input type="text" {...register("title")} id="title" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.title && <span className="text-xs text-red-600">{errors.title?.message}</span>}
              </label>

              <label htmlFor="city-name" className="flex flex-col font-medium w-full sm:w-[31.13%]">
                City name
                <input type="text" {...register("cityname")} id="city-name" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.cityname && <span className="text-xs text-red-600">{errors.cityname?.message}</span>}
              </label>

              <label htmlFor="type" className="flex flex-col font-medium w-full sm:w-[31.13%]">
                Type
                <select {...register('type')} id="type" className="border border-text-color-2 rounded p-1 font-normal" >
                  <option value="" disabled selected >Choose Type</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
                {errors.type && <span className="text-xs text-red-600">{errors.type?.message}</span>}
              </label>

              <label htmlFor="price" className="flex flex-col font-medium w-full sm:w-[31.13%]">
                Price
                <input min={10} max={1000000} type="number" {...register('price')} id="price" className="border border-text-color-2 rounded p-1 font-normal" placeholder="$USD/month" />
                {errors.price && <span className="text-xs text-red-600">{errors.price?.message}</span>}
              </label>

              <label htmlFor="address" className="flex flex-col font-medium w-full sm:w-[100%]">
                Address
                <input type="text" {...register('address')} onChange={(e) => onAddressChange(e)} id="address" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.address && <span className="text-xs text-red-600">{errors.address?.message}</span>}
              </label>

              {latlonMutation.isPending && <div className="text-color1 text-sm">Fetching coordinates...</div>}
              {latlonMutation.isError && <div className="text-sm text-red-500">Failed to fetch coordinates</div>}
              {latlonMutation.isSuccess && (
                <>
                  <label htmlFor="lat" className="flex flex-col font-medium w-full sm:w-[30%]">
                    Latitude
                    <input type="number" step="any" {...register('lat')} value={coordinates.lat} id="lat" className="border border-text-color-2 rounded p-1 font-normal" />
                    {errors.lat && <span className="text-xs text-red-600">{errors.lat?.message}</span>}
                  </label>

                  <label htmlFor="long" className="flex flex-col font-medium w-full sm:w-[30%]">
                    Longitude
                    <input type="number" step="any" {...register('long')} value={coordinates.long} id="long" className="border border-text-color-2 rounded p-1 font-normal" />
                    {errors.long && <span className="text-xs text-red-600">{errors.long?.message}</span>}
                  </label>
                </>
              )}

              <div className="w-full mb-10">
                <label htmlFor="desc" className="font-medium" >Description</label>

                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => <ReactQuill {...field} id="desc" theme="snow" className="h-60" />}
                  rules={{ required: true }}
                />

                {errors.description && <span className="text-xs text-red-600">{errors.description?.message}</span>}
              </div>

              <label htmlFor="bedrooms" className="flex flex-col font-medium max-sm:mt-6 w-[45%] sm:w-[30%]">
                Bedrooms
                <input min={0} type="number" {...register('bedrooms')} id="bedrooms" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.bedrooms && <span className="text-xs text-red-600">{errors.bedrooms?.message}</span>}
              </label>

              <label htmlFor="bathrooms" className="flex flex-col font-medium max-sm:mt-6 w-[45%] sm:w-[30%]">
                Bathrooms
                <input min={0} type="number" {...register('bathrooms')} id="bathrooms" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.bathrooms && <span className="text-xs text-red-600">{errors.bathrooms?.message}</span>}
              </label>


              <label htmlFor="size" className="flex flex-col font-medium w-full sm:w-[30%]">
                Total Size (sqft)
                <input min={0} type="number" {...register('totalSize')} id="size" className="border border-text-color-2 rounded p-1 font-normal" />
                {errors.totalSize && <span className="text-xs text-red-600">{errors.totalSize?.message}</span>}
              </label>


              <div className="w-full">

                <label htmlFor="amenities" className="flex flex-col font-medium mb-7">Available Amenities</label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='parking'>
                    <input type="checkbox" {...register('amenities')} value="parking" id="parking" className='h-5 w-5 rounded-md' />
                    Garage/Parking
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='outdoor-space'>
                    <input type="checkbox" {...register('amenities')} value="outdoor-space" id="outdoor-space" className='h-5 w-5 rounded-md' />
                    Yard/outdoor space
                  </label>


                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='pool'>
                    <input type="checkbox" {...register('amenities')} value="pool" id="pool" className='h-5 w-5 rounded-md' />
                    Pool
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='fireplace'>
                    <input type="checkbox" {...register('amenities')} value="fireplace" id="fireplace" className='h-5 w-5 rounded-md' />
                    Fireplace
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='heating-cooling'>
                    <input type="checkbox" {...register('amenities')} value="heating-cooling" id="heating-cooling" className='h-5 w-5 rounded-md' />
                    Heating/cooling system
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='pet-friendly'>
                    <input type="checkbox" {...register('amenities')} value="pet-friendly" id="pet-friendly" className='h-5 w-5 rounded-md' />
                    Pet-friendly
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='office-space'>
                    <input type="checkbox" {...register('amenities')} value="office-space" id="office-space" className='h-5 w-5 rounded-md' />
                    Home office/study space
                  </label>

                  <label className='flex items-center gap-3 cursor-pointer' htmlFor='alarm-system'>
                    <input type="checkbox" {...register('amenities')} value="alarm-system" id="alarm-system" className='h-5 w-5 rounded-md' />
                    Smoke alarm
                  </label>

                </div>
                {errors.amenities && <span className="text-xs text-red-600">{errors.amenities?.message}</span>}

              </div>


              <button className="btn-primary mt-8 h-full">{isSubmitting ? "Submitting..." : "Submit listing"}</button>



            </form>
          </div>

          <div className="w-full lg:w-2/5 h-full">
            <div className="p-6 rounded-md bg-[#f5f5f5] min-h-52 lg:min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-full flex justify-center flex-col items-center" id="images-upload">
                <div className="grid grid-cols-2  gap-2 mb-6 w-full">
                  {images.map((image, index) => (
                    <div className="relative" key={index}>
                      <button onClick={() => setImages(images.filter((_, i) => i !== index))} className="p-0.5 rounded-full text-white bg-black flex items-center justify-center text-lg absolute right-2 top-2"><IoClose /></button>

                      <img src={URL.createObjectURL(image)} alt="" className="rounded-md w-full h-40 object-cover" />
                    </div>
                  ))}
                </div>
                <Dropzone
                  onDrop={(acceptedFiles, rejectedFiles) => {
                    const files = [...images, ...acceptedFiles]
                    setImages(files)
                  }}
                  accept={{ 'image/*': [] }}
                >

                  {({ getRootProps, getInputProps }) => (
                    <section className="w-full">
                      <div className="w-full min-h-20 flex flex-col items-center justify-center gap-3 border-2 border-gray-400 border-dashed rounded-md p-5" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="text-center max-xl:hidden">Drag 'n' drop images here <br /> or</p>
                        <button className="py-2 px-6 bg-color1 rounded-md text-white text-xs md:text-sm font-medium" >Click here to upload images</button>
                      </div>
                    </section>
                  )}
                </Dropzone>

                {errors.images && <span className="text-sm text-red-600">{errors.images?.message}</span>}

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AddListing