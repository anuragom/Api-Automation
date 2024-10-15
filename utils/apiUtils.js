import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import { loginURL, sellerPortalURL} from '../utils/config.js';

/**
 * Makes a POST request to create an order.
 * @param {Object} payload - The order payload to send in the request.
 * @returns {Promise} - Returns a promise with the API response.
 */


export async function loginToSellerPortal(payload){
  return axios.post(`${loginURL}`, payload);
}

export async function createOrder(endpoint,payload) {
  return axios.post(`${baseURL}/${endpoint}`, payload, {
    headers: external_apis_headers
  });
}
