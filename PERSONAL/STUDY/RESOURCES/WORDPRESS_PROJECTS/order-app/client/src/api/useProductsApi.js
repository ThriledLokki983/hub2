import { useQuery } from "react-query";
import axios from 'axios';

const getProducts = async () => {
    const { data } = await axios.get("http://localhost:4001/api/products/bulk");
    return data;
};

export const useProductsApi = () => {
    return useQuery("products", getProducts);
};
