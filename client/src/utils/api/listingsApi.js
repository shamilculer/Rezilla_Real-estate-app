import axios from 'axios'
import api from '../../lib/api'

const fetchListings = async ({itemsPerPage = 8, pageParam = 1, searchParams = new URLSearchParams() }) => {

  let params = new URLSearchParams(searchParams);
  params.set('page', pageParam.toString());
  params.set("itemsPerPage", itemsPerPage)


  params.page = pageParam
  const options = {
    params
  }
  try {
    const response = await api.get('/listings', options)
    return response.data
  } catch (error) {
    throw error
  }

}

const fetchListing = async ({ queryKey }) => {
  const id = queryKey[1]
  try {
    const response = await api.get(`listings/${id}`);
    return response.data.listing;
  } catch (error) {
    throw error?.response
  }
}

const addNewListing = async (data) => {
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
  }
  }

  try {
    const response = await api.post("/listings/new", data, config)
    return response.data?.listing;
  } catch (error) {
    throw error
  }
}

const fetchLatlon = async (params) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search',{params})
    if(response.data.length > 0){
      return response.data[0]
    }else{
      throw new Error('No location found')
    }
  } catch (error) {
    throw error
  }
}

const deleteLilsting = async (listingId) => {
  try {
    const response = await api.delete(`/listings/delete/${listingId}`)
    return response.status
  } catch (error) {
    throw error
  }
}

export { fetchListings, fetchListing, addNewListing, fetchLatlon, deleteLilsting }