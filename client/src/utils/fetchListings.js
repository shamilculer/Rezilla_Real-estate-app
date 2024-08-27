import axios from "axios";

// axios.defaults.headers = {
//     'X-RapidAPI-Key': 'a5a127b871msh738be9b5e986615p1c8934jsncdcfbb1d83b8',
//     'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
// }

// const axiosForProperties = axios.create({
//     baseURL : "https://bayut.p.rapidapi.com/properties"
// })
const fetchListings = (params) => {
    const options = {
        url: 'https://bayut.p.rapidapi.com/properties/list',
        params: {
          locationExternalIDs: '5002,6020',
          lang: 'en',
          ...params
        },
        headers: {
          'X-RapidAPI-Key': 'a5a127b871msh738be9b5e986615p1c8934jsncdcfbb1d83b8',
          'X-RapidAPI-Host': 'bayut.p.rapidapi.com'
        }
          };
      
          try {
              return axios.request(options);
          } catch (error) {
              throw new Error("fetching Error")
          }
  }

  export default fetchListings



