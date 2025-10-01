import { useQuery } from "react-query";
import axios from 'axios';

const getCustomers = async () => {
    const { data } = await axios.get("http://localhost:4001/api/customers/");
    return data;
};

export const useCustomersApi = () => {
    return useQuery("customers", getCustomers);
};
