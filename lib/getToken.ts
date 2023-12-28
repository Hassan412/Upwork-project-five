import axios from "axios";
const clientId = "4e6bbe6bdd9b4578aea5e360ff4b0704";
const clientSecret = "f1ede1b4c1794213bafa95aa1a9aeeaa";
export default async function getToken(){
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        null,
        {
          params: {
            grant_type: 'client_credentials',
          },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token
}