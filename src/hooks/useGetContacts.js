import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useGetContacts = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Select the token from the auth slice
  const token = useSelector((state) => state.auth?.token);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://159.65.82.164/api/v1/contacts", {
          headers: {
            Accept: 'text/csv', // Expect CSV response
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          responseType: 'text', // Ensure response is treated as text
        });
        setData(response.data); // Set the raw CSV data
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [token]); // Refetch if token changes

  return { data, error, isLoading };
};

export default useGetContacts;
