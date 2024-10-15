import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {wrapperPayload} from '../utils/payloads/payload.js';
import { generateOrderCode } from '../utils/functions/generate_order_code.js';

const orderCode = generateOrderCode();
const global_order_id = orderCode;

describe('Wrapper API', function() {
    // Use `function` instead of arrow function so that `this.timeout()` works
    it('should create order with wrapper successfully', async function() {
      // Optional: Extend timeout if necessary
      this.timeout(5000); // Increase timeout to 5 seconds if your API takes time
  
      const payload = wrapperPayload(orderCode);
    
    try {
      const response = await axios.post(`${baseURL}/wrapper`, payload, {
        headers: external_apis_headers
      });

      console.log('Response:', response.data);

      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('orderId');
      expect(response.data).to.have.property('remarks');
      expect(response.data).to.have.property('orderCreated');
      expect(response.data).to.have.property('shipment');
    //   // Add assertions to verify the response
      expect(response.data.status).to.equal('SUCCESS', 'Expected status to be SUCCESS');
      expect(response.data.remarks).to.equal('', 'Expected remarks');
      expect(response.data.orderId).to.equal(global_order_id, 'Expected order id');
      expect(response.data.orderCreated).to.equal(true, 'Expected order creation value');
      expect(response.data.shipment[0].awbGenerated).to.equal(true, 'Expected awb generated field');
      expect(response.data.shipment[0].labelGenerated).to.equal(true, 'Expected label Generated field');
      expect(response.data.shipment[0].pickupScheduled).to.equal(true, 'Expected pickup Scheduled field');

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

