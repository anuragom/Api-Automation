import {expect}  from 'chai';
import axios from 'axios';
import { baseURL, external_apis_headers } from '../utils/config.js';
import {serviceability_check_payload} from '../utils/payloads/payload.js';

describe('Serviceability Check API', () => {
  it('should Check Serviceability successfully', async () => {
    const Pickup_pincode = "110001";
    const Delivery_pincode = "110003";
    const cod = true;
    const total_order_value = 2000;
    const weight = 1.12;
    // console.log('Generated Order Code:', orderCode);
    const payload = serviceability_check_payload(Pickup_pincode,Delivery_pincode,cod,total_order_value,weight);
    
    try {
      const response = await axios.post(`${baseURL}/serviceabilty_check`, payload, {
        headers: external_apis_headers
      });
    //   console.log(response.data);
      // Validate response structure first
      expect(response.data).to.have.property('status');
      expect(response.data).to.have.property('remark');
      expect(response.data).to.have.property('serviceable_courier_list');

    // // // //   // Add assertions to verify the response
      expect(response.data.status).to.equal(true, 'Expected status to be true');
      expect(response.data.remark).to.equal('Success', 'Expected Remarks');
      expect(response.data.serviceable_courier_list.length).to.equal(11,'Expected count of courier');
    
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

