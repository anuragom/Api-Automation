import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {label_generation_payload} from '../utils/payloads/payload.js';
// import { generateOrderCode } from '../utils/functions/generate_order_code.js';

import {global_shipment_id} from '../test/pickup_schedule.js';

describe(' Shipments label generation API', () => {
  it('should generate label of all shipments successfully', async () => {
    const shipmentCode = [global_shipment_id];
    // console.log('Generated Order Code:', orderCode);
    const payload = label_generation_payload(shipmentCode);
    
    try {
      const response = await axios.post(`${baseURL}/generate_label`, payload, {
        headers: external_apis_headers
      });
      console.log(response.data);
      // Validate response structure first
    //   expect(response.data).to.have.property('status');
    //   expect(response.data).to.have.property('remarks');

    // // //   // Add assertions to verify the response
    //   expect(response.data.status).to.equal(true, 'Expected status to be true');
    //   expect(response.data.remarks).to.equal('Shipment successfully de-allocated.', 'Expected Remarks');
    
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
