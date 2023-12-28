import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Product name must be longer than 2 characters!')
        .max(50, 'Product name must be shorter than 50 characters!')
        .required('Product name is required!'),
    price: Yup.number()
        .min(1, 'Product price must be greater than 0!')
        .positive('Product price must be a positive number!')
        .integer('Product price must be a number!')
        .required('Product price is required!'),
    description: Yup.string()
        .min(10, 'Product description must be longer than 10 characters!')
        .max(255, 'Product description must be shorter than 255 characters!')
        .required('Product description is required!'),
    image: Yup.string()
        .min(10, 'Product image URL must be longer than 10 characters!')
        .max(255, 'Product image URL must be shorter than 255 characters!')
        .required('Product image URL is required!'),
})