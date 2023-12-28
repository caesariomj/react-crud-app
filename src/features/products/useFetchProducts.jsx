// Also known by React hooks

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

export const useFetchProducts = ({ onError }) => {
    return useQuery({
        queryFn: async () => {
            const productResponse = await axiosInstance.get("/products");

            return productResponse;
        },
        queryKey: ["fetch.products"],
        onError,
    })
}