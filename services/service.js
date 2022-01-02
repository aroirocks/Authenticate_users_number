const API_ENDPOINT = 'YOUR_API_ENDPOINT';

export const sendOtp = async phoneNumber => {
  try {
    const response = await axios({
      method: 'post',
      url: `${API_ENDPOINT}/send-otp`,
      data: {
        phoneNumber,
      },
    });
    return Promise.resolve(response);
  } catch (err) {
    /* Handle custom error messages from server */
    return Promise.reject(err.response);
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await axios({
      method: 'post',
      url: `${API_ENDPOINT}/verify`,
      data: {
        phoneNumber,
        otp,
      },
    });
    return Promise.resolve(response);
  } catch (err) {
    /* Handle custom error messages from server */
    return Promise.reject(err.response);
  }
};
