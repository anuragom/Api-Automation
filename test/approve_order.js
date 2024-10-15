import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {approveOrderPayload} from '../utils/payloads/payload.js';
// import { generateOrderCode } from '../utils/functions/generate_order_code.js';

import { global_order_id } from '../test/create_order.js';
console.log('global_order_id',global_order_id);
let global_shipment_id;
let global_storeName;

describe('Approve Order API', () => {
  it('should approve an order successfully', async () => {
    const orderCode = global_order_id[0];
    const store_name = "DEFAULT";
    global_storeName= store_name;
    // console.log('Generated Order Code:', orderCode);
    const payload = approveOrderPayload(orderCode,store_name);
    
    try {
      const response = await axios.post(`${baseURL}/approve_orders`, payload, {
        headers: external_apis_headers
      });

      // console.log('Response:', response.data);
      // console.log('Response:', response.data.order_list[0].shipment);
      global_shipment_id= response.data.order_list[0].shipment[0].shipment_id;
      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remark');
      expect(response.data).to.have.property('success_count');
      expect(response.data).to.have.property('failure_count');
      expect(response.data).to.have.property('order_list');

      // Add assertions to verify the response
      expect(response.data.status).to.equal('success', 'Expected status to be SUCCESS');
      expect(response.data.remark).to.equal('Approved orders successfully', 'Expected Remark');
      expect(response.data.success_count).to.equal(1, 'Expected success_count');
      expect(response.data.failure_count).to.equal(0, 'Expected failure_count');
      expect(response.data.order_list[0].order_id).to.equal(orderCode, 'Expected order id');
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

export {global_shipment_id,global_order_id,global_storeName};
