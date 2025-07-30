import axios from 'axios';

const logger = async (stack, level, pkg, message) => {
  try {
    const res = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      { stack, level, package: pkg, message },
      {
        headers: {
          Authorization: process.env.REACT_APP_AUTH_HEADER,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Logged:', res.data.message);
  } catch (err) {
    console.error('Logger Error:', err.response?.data || err.message);
  }
};

export default logger;
