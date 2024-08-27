import * as yup from "yup";

const passwordUpdateSchema = yup
  .object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(12, 'Password must be at most 12 characters'),

  confirmedPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
  })
  .required()


export default passwordUpdateSchema
