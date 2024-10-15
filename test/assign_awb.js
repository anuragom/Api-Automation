import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {assignAWBPayload} from '../utils/payloads/payload.js';
// import { generateOrderCode } from '../utils/functions/generate_order_code.js';

import { global_shipment_id,global_order_id } from '../test/approve_order.js';

let awb;
describe('Assign AWB API', () => {
  it('should assign awb to an shipment successfully', async () => {
    const shipmentCode = global_shipment_id;
    const courier_code = "3001";
    // console.log('Generated Order Code:', orderCode);
    const payload = assignAWBPayload(shipmentCode,courier_code);
    
    try {
      const response = await axios.post(`${baseURL}/assign_awb`, payload, {
        headers: external_apis_headers
      });

    //   console.log('Response:', response.data); 
    awb = response.data.awb;
    //   console.log('Response:', response.data.order_list[0].shipment);
    //   global_shipment_id= response.data.order_list[0].shipment[0].shipment_id;
      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remarks');
      expect(response.data).to.have.property('shipment_id');
      expect(response.data).to.have.property('order_id');
      expect(response.data).to.have.property('awb');
      expect(response.data).to.have.property('courier_code');
      expect(response.data).to.have.property('courier_name');
      expect(response.data).to.have.property('parent_courier_name');
      expect(response.data).to.have.property('applied_weight');
      expect(response.data).to.have.property('rto_routing_code');
      expect(response.data).to.have.property('pickup_name');
      expect(response.data).to.have.property('payment_method');
      expect(response.data).to.have.property('total_order_value');
      expect(response.data).to.have.property('collectable_amount');

      // Add assertions to verify the response
      expect(response.data.status).to.equal('SUCCESS', 'Expected status to be SUCCESS');
      expect(response.data.remarks).to.equal('SUCCESS', 'Expected Remarks');
      expect(response.data.shipment_id).to.equal(shipmentCode, 'Expected shipment_id');
      expect(response.data.order_id).to.equal(global_order_id, 'Expected order id');
      expect(response.data.courier_code).to.equal(courier_code, 'Expected courier code');
      // expect(response.data.courier_name).to.equal('Delhivery Surface', 'Expected courier name');
      // expect(response.data.parent_courier_name).to.equal('Delhivery', 'Expected parent courier code');
      expect(response.data.pickup_name).to.equal('Second', 'Expected pickup_name');
      expect(response.data.payment_method).to.equal('COD', 'Expected payment_method');
      expect(response.data.total_order_value).to.equal(145, 'Expected total order value');
      expect(response.data.collectable_amount).to.equal(95, 'Expected collectable_amount');
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


export {global_shipment_id,global_order_id, awb}

