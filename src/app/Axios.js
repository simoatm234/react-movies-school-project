import axios from 'axios';

const BASE_URL = import.meta.env.VITE_TMDB_API_URL;
const ACCESS_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN_ACCESS;

export const customAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    Accept: 'application/json',
  },
});