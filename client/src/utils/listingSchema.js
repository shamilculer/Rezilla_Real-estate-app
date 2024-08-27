import * as yup from "yup";

const listingSchema = yup
  .object({
    title: yup
    .string()
    .required('title is required')
    .min(6, 'title must be at least 6 characters')
    .max(72, 'title must be at most 72 characters'),
  
  cityname: yup
    .string()
    .required('City name is required')
    .max(32, 'City name must be at most 32 characters'),

  type: yup
    .string()
    .required('Please choose your property is for rent or for sale'),


  address : yup
    .string()
    .required('Address is required'),
   
  price : yup
    .number()
    .required('Please enter a price')
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value)
    .min(10, "Price must be at least 10 dollars")
    .max(1000000, "Price must be at most 100,000 dollars"),

  description : yup
   .string(),

  bedrooms : yup
    .number()
    .required('Please enter number of bedrooms')
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value),
    
  bathrooms : yup
    .number()
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value)
    .required('Please enter number of bathrooms'),
    
  totalSize : yup
    .number()
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value)
    .required('Please enter total size of property'),
    
  lat : yup
    .number()
    .required('Please enter latitude')
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value),
    
  long : yup
    .number()
    .transform((value, originalValue) => originalValue.trim() === '' ? undefined : value)
    .required('Please enter longitude'),
    
  amenities  : yup
     .array().of(yup.string()),
       
  })
  .required()



export default listingSchema