import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {cancel_order_payload} from '../utils/payloads/payload.js';

import {global_order_id,global_storeName} from '../test/approve_order.js';

describe('Cancel Order API', () => {
  it('should cancel an order successfully', async () => {
    const orderCode = global_order_id;
    const store_name = global_storeName;
    // console.log('Generated Order Code:', orderCode);
    const payload = cancel_order_payload(orderCode,store_name);
    
    try {
      const response = await axios.post(`${baseURL}/cancel_order`, payload, {
        headers: external_apis_headers
      });
      console.log(response.data);
      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remarks');

    // // //   // Add assertions to verify the response
      expect(response.data.status).to.equal(true, 'Expected status to be true');
      expect(response.data.remarks).to.equal('Order cancelled successfully.', 'Expected Remarks');
    
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);

      // In case of failure, we can add more checks on the error response if necessary
      if (error.response) {
        expect.fail('API request failed with status:', error.response.status);
      } else {
        expect.fail('Unexpected error:', error.message);
      }
    }
  });
});

