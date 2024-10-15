import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {deallocatePayload} from '../utils/payloads/payload.js';
// import { generateOrderCode } from '../utils/functions/generate_order_code.js';

import {global_shipment_id, global_order_id} from '../test/pickup_schedule.js';

describe('De-allocate Shipment API', () => {
  it('should de-allocate an shipment successfully', async () => {
    const orderCode = global_order_id;
    const shipmentCode = global_shipment_id;
    // console.log('Generated Order Code:', orderCode);
    const payload = deallocatePayload(orderCode,shipmentCode);
    
    try {
      const response = await axios.post(`${baseURL}/de_allocate_shipment`, payload, {
        headers: external_apis_headers
      });

      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remarks');

    // //   // Add assertions to verify the response
      expect(response.data.status).to.equal(true, 'Expected status to be true');
      expect(response.data.remarks).to.equal('Shipment successfully de-allocated.', 'Expected Remarks');
    
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

export {}
