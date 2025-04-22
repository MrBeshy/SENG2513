import axios from 'axios';

const fetchMoonPhase = async () => {
  const options = {
    method: 'GET',
    url: 'https://moon-phase.p.rapidapi.com/basic',
    headers: {
      'x-rapidapi-key': '578c9e32a7msh5081ccdc2c4b1b8p13095ejsn12e8dac804f8',
      'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Moon phase API request failed:', error.response?.data || error.message);
    throw error;
  }
};

export default fetchMoonPhase;
