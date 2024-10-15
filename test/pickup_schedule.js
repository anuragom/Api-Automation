import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {pickupSchedulePayload} from '../utils/payloads/payload.js';
// import { generateOrderCode } from '../utils/functions/generate_order_code.js';

import {global_shipment_id, global_order_id, awb} from '../test/assign_awb.js';

describe('Pickup Schedule API', () => {
  it('should pickup schedule an shipment successfully', async () => {
    const shipmentCode = global_shipment_id;
    const payload_awb = awb;
    // console.log('Generated Order Code:', orderCode);
    const payload = pickupSchedulePayload(shipmentCode,payload_awb);
    
    try {
      const response = await axios.post(`${baseURL}/schedule_pickup`, payload, {
        headers: external_apis_headers
      });

      console.log('Response:', response.data);
    //   console.log('Response:', response.data.order_list[0].shipment);
    //   global_shipment_id= response.data.order_list[0].shipment[0].shipment_id;
      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remarks');
      expect(response.data).to.have.property('shipmentId');
      expect(response.data).to.have.property('orderId');
      expect(response.data).to.have.property('awb');
      expect(response.data).to.have.property('courierCode');
      expect(response.data).to.have.property('courierName');
      expect(response.data).to.have.property('parentCourierName');
      expect(response.data).to.have.property('routingCode');
      expect(response.data).to.have.property('rtoRoutingCode');

    //   // Add assertions to verify the response
      expect(response.data.status).to.equal('SUCCESS', 'Expected status to be SUCCESS');
      expect(response.data.remarks).to.equal('SUCCESS', 'Expected Remarks');
      expect(response.data.shipmentId).to.equal(shipmentCode, 'Expected shipment_id');
      expect(response.data.orderId).to.equal(global_order_id, 'Expected order id');
      expect(response.data.awb).to.equal(awb, 'Expected courier code');
      expect(response.data.courierCode).to.equal('3001', 'Expected courier code');
      expect(response.data.courierName).to.equal('Ecom Express Surface', 'Expected courier name');
      expect(response.data.parentCourierName).to.equal('Ecom Express', 'Expected parent courier name');
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

export {global_shipment_id, global_order_id}
