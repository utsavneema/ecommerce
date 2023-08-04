import axios from "axios";
export const baseUrl = 'http://localhost:4000/'


export const priceFormat = () => {
    return 'Rs. ';
  };

  // export const nameForm = () => {
  //   return 'Hello: ';
  // };

export const tokenPresent = () => {
  const authToken = localStorage.getItem('authToken');
  return authToken !== null;
};

export const getUserDetail = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const response = await axios.get(baseUrl + 'api/auth', {
        headers: {
          Authorization: token,
        },
      });
      const { userDetails } = response.data;
      if (userDetails) {
        return userDetails;
      }
    } catch (error) {
      console.error('Error', error);
    }
  }
};

