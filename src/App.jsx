import { useFormik } from "formik";
import { useFetchProducts, useCreateProduct, useDeleteProduct, usePatchProduct } from "./features/products/index.jsx";
import { productValidationSchema } from "./validations/productValidationSchema.jsx"

const App = () => {

  const {
    data,
    isLoading: productIsLoading,
    refetch: refetchProducts,
    error: fetchProductsError,
  } = useFetchProducts({
    onError: () => {
      alert("There was an Error from onError!");
    }
  });

  if (fetchProductsError) {
    alert(`There was an ${fetchProductsError.message} !`);
  }

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      price: 0,
      description: "",
      image: "",
    },
    validationSchema: productValidationSchema,
    onSubmit: () => {
      const { id, name, price, description, image } = formik.values;

      if (id) {
        editProduct({
          id: id,
          name: name,
          price: parseInt(price),
          description: description,
          image: image,
        });
      } else {
        createProduct({
          name: name,
          price: parseInt(price),
          description: description,
          image: image,
        });
      }

      alert("Form submitted");

      formik.setFieldValue("id", 0);
      formik.setFieldValue("name", "");
      formik.setFieldValue("price", 0);
      formik.setFieldValue("description", "");
      formik.setFieldValue("image", "");

    },
  });

  const { mutate: createProduct, isLoading: createProductIsLoading } = useCreateProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: editProduct, isLoading: editProductIsLoading } = usePatchProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const { mutate: deleteProduct } = useDeleteProduct({
    onSuccess: () => {
      refetchProducts();
    },
  });

  const handleFormInput = (event) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const confirmDelete = (id) => {
    const shouldDelete = confirm("Are you sure ?");

    if (shouldDelete) {
      deleteProduct(id);
    }
  };

  const onEditInput = (product) => {
    formik.setFieldValue("id", product.id);
    formik.setFieldValue("name", product.name);
    formik.setFieldValue("price", product.price);
    formik.setFieldValue("description", product.description);
    formik.setFieldValue("image", product.image);
  };

  const renderProducts = () => {
    return data?.data.map((product) => {
      return (
        <tr key={product.id} className="border-b text-sm">
          <td className="py-2 px-6">{product.id}</td>
          <td className="py-2 px-6">{product.name}</td>
          <td className="py-2 px-6">{product.price}</td>
          <td className="py-2 px-6">{product.description}</td>
          <td className="py-2 px-6 flex items-center gap-x-2 mt-0.5">
            <button
              type="button"
              className="bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() => onEditInput(product)}
            >
              Edit
            </button>
            <button
              type="button"
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() => confirmDelete(product.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <h1 className="font-bold text-5xl tracking-tighter">
          Basic CRUD Using React
        </h1>
        <div className="relative overflow-x-auto">
          <table className="w-full text-base text-left text-gray-900">
            <thead className="text-xs text-gray-800 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" colSpan={2} className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {renderProducts()}
              {productIsLoading || editProductIsLoading ? (
                <tr>
                  <td colSpan={4}>
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <h2 className="font-bold text-2xl tracking-tighter">
          Form Input
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          method="post"
          className="flex flex-col"
        >
          <div className="mb-2 flex flex-col">
            <label htmlFor="id" className="mb-2 font-semibold tracking-tight">
              Product ID
            </label>
            <input
              onChange={handleFormInput}
              type="text"
              name="id"
              id="id"
              placeholder="Product name"
              value={formik.values.id}
              className="p-2 border text-gray-400 border-gray-400 rounded"
              readOnly
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold tracking-tight">
              Product Name
            </label>
            <input
              onChange={handleFormInput}
              type="text"
              name="name"
              id="name"
              placeholder="Product name"
              value={formik.values.name}
              className={`p-2 border rounded ${formik.touched.name && formik.errors.name ? 'border-red-600' : 'border-gray-900'}`}
            />
            {formik.touched.name && formik.errors.name ? (
              <span className="text-sm font-semibold text-red-600 mt-1">{formik.errors.name}</span>
            ) : null}
          </div>
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="price"
              className="mb-2 font-semibold tracking-tight"
            >
              Product Price
            </label>
            <input
              onChange={handleFormInput}
              type="text"
              name="price"
              id="price"
              placeholder="Product price"
              value={formik.values.price}
              className={`p-2 border rounded ${formik.touched.price && formik.errors.price ? 'border-red-600' : 'border-gray-900'}`}
            />
            {formik.touched.price && formik.errors.price ? (
              <span className="text-sm font-semibold text-red-600 mt-1">{formik.errors.price}</span>
            ) : null}
          </div>
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="description"
              className="mb-2 font-semibold tracking-tight"
            >
              Product Description
            </label>
            <input
              onChange={handleFormInput}
              type="text"
              name="description"
              id="description"
              placeholder="Product description"
              value={formik.values.description}
              className={`p-2 border rounded ${formik.touched.description && formik.errors.description ? 'border-red-600' : 'border-gray-900'}`}
            />
            {formik.touched.description && formik.errors.description ? (
              <span className="text-sm font-semibold text-red-600 mt-1">{formik.errors.description}</span>
            ) : null}
          </div>
          <div className="mb-5 flex flex-col">
            <label
              htmlFor="image"
              className="mb-2 font-semibold tracking-tight"
            >
              Product Image
            </label>
            <input
              onChange={handleFormInput}
              type="text"
              name="image"
              id="image"
              placeholder="Product image"
              value={formik.values.image}
              className={`p-2 border rounded ${formik.touched.image && formik.errors.image ? 'border-red-600' : 'border-gray-900'}`}
            />
            {formik.touched.image && formik.errors.image ? (
              <span className="text-sm font-semibold text-red-600 mt-1">{formik.errors.image}</span>
            ) : null}
          </div>
          {createProductIsLoading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <button
              type="submit"
              className="bg-gray-900 py-2 rounded text-white font-semibold text-lg hover:bg-gray-800"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default App;
