import * as yup from "yup";

const userSchema = yup
  .object({
    username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 10 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(12, 'Password must be at most 12 characters'),
  })
  .required()


  const getValidationSchema = (condition) => {

    if(condition === "login") {
      delete userSchema.fields.username
      return userSchema
    }else if(condition === "updation"){
      delete userSchema.fields.password
      return userSchema
    }else{
      return userSchema
    }
  
  }



export default getValidationSchema