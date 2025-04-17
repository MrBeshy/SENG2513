import axios from 'axios';

const fetchMoonPhase = async (lat, lon) => {
  const options = {
    method: 'GET',
    url: 'https://moon-phase.p.rapidapi.com/advanced',
    params: {
      lat,
      lon
    },
    headers: {
      'x-rapidapi-key': '578c9e32a7msh5081ccdc2c4b1b8p13095ejsn12e8dac804f8',
      'x-rapidapi-host': 'moon-phase.p.rapidapi.com'
    }
  };

  const response = await axios.request(options);
  return response.data;
};

export default fetchMoonPhase;
