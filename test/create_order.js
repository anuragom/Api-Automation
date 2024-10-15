import { expect } from 'chai';
import { createOrderPayload } from '../utils/payloads/payload.js';
import { generateOrderCode,generateContactName } from '../utils/functions/generate_order_code.js';
import { validateCreateOrderResponse } from '../Assertions/external_apis/api.js';
import { createOrder,loginToSellerPortal } from '../utils/apiUtils.js';
import { getExpectedAssertions,getExpectedAssertionsLogin } from '../utils/Assertions_data/create_order.js';
import { create_an_order }  from '../Payload_struct/external_apis/create_order_struct.js'
import { random_package_details }  from '../Payload_struct/external_apis/create_order_struct.js';
import { exist_pickup_location }  from '../Payload_struct/external_apis/create_order_struct.js';
import { new_pickup_location }  from '../Payload_struct/external_apis/create_order_struct.js'
import { billing_is_shipping_flag_false }  from '../Payload_struct/external_apis/create_order_struct.js'
import { new_item_name }  from '../Payload_struct/external_apis/create_order_struct.js'
import { new_SKU }  from '../Payload_struct/external_apis/create_order_struct.js'
import { new_SKU_details }  from '../Payload_struct/external_apis/create_order_struct.js'
import { prepaid_payment_method }  from '../Payload_struct/external_apis/create_order_struct.js';
import { random_extra_charges }  from '../Payload_struct/external_apis/create_order_struct.js'
import { login_seller_portal }  from '../Payload_struct/session/login_struct.js';

const UAT_PICKUP_LOCATION = "Second";
const global_order_id = [];

// describe('Create Order API', () => {
//   const payloads = JSON.parse(createOrderPayload());
  
//   payloads.forEach((payload, index) => {
//     it(`should create an order successfully for payload index ${index}`, async () => {
//       const orderCode = generateOrderCode();
//       const contact_name = generateContactName();
//       console.log('dfdfdf',contact_name);
//       global_order_id.push(orderCode); 
//       payload.orderId = orderCode;
//       if(index == 3){
//       payload.pickupLocation.contactName = contact_name;
//       payload.pickupLocation.pickupName = contact_name;
//       payload.pickupLocation.pickupEmail = `${contact_name}@gmail.com`;
//       payload.pickupLocation.pickupPhone = orderCode;
//       payload.pickupLocation.pickupAddress1 = contact_name;
//       // payload.pickupLocation.pinCode = contact_name;
//       }
      
//       // Get expected assertions for this specific index
//       const expectedAssertions = getExpectedAssertions(orderCode, index);

//       try {
//         const response = await createOrder('create_order', payload);

//         // Validate the response for the current payload and assertions
//         validateCreateOrderResponse(response.data, expectedAssertions);
//       } catch (error) {
//         console.error(`Error in payload index ${index}:`, error.response ? error.response.data : error.message);

//         if (error.response) {
//           expect.fail(`API request failed for payload index ${index} with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
//         } else {
//           expect.fail(`Unexpected error at payload index ${index}: ${error.message}`);
//         }
//       }
//     });
//   });
// });

describe('Create Order API', () => {
    it(`should generate an login token`, async ()=>{
      const payload = JSON.parse(loginPayload());
      
      login_seller_portal(payload);

      const expectedAssertions = getExpectedAssertionsLogin();
      
      try {
        const response = await loginToSellerPortal(payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }

    })
    it(`should create an order successfully`, async () => {
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();

      create_an_order(payload,orderCode);
      // console.log(payload);
      // Get expected assertions for this specific index
      const expectedAssertions = getExpectedAssertions(orderCode);

      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with already "Exist pickup location" successfully`, async () => {
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      exist_pickup_location(payload, orderCode, UAT_PICKUP_LOCATION);
      const expectedAssertions = getExpectedAssertions(orderCode);

      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "New pickup location" successfully`, async () => {
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const contact_name = generateContactName(); 

      // payload.orderId = orderCode;

      new_pickup_location(payload, orderCode, contact_name);
      const expectedAssertions = getExpectedAssertions(orderCode);

      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "Billing is shipping flag false" successfully`, async () => {
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const billingIsShipping = false;
      
      billing_is_shipping_flag_false(payload, orderCode, billingIsShipping)

      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "New Item Name" successfully`, async () => {
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const item_name = generateContactName();
      new_item_name(payload, orderCode, item_name)
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "New SKU" successfully`, async ()=>{
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const sku_name = generateContactName();
      new_SKU(payload, orderCode, sku_name);
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "New SKU Details" successfully`, async ()=>{
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const sku_name = generateContactName();
      const description = "It is a new description";
      const units = 2;
      const unitPrice = 90;
      const tax = 0;
      const hsn = "101011";
      const productLength = 12;
      const productBreadth = 13;
      const productHeight = 14;
      const productWeight = 1.3;
      const brand = "Brand b";
      const imageURL = "http://example.com/prod.jpg";

      new_SKU_details(payload, orderCode, sku_name,description, units,unitPrice, tax, hsn,productLength, productBreadth,productHeight, productWeight,brand, imageURL);
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "Prepaid Payment Method" successfully`, async ()=>{
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const paymentMethod = "PREPAID";
      prepaid_payment_method(payload, orderCode,paymentMethod );
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "Random Extra Charges" successfully`, async ()=>{
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      const shippingCharges = 140;
      const giftWrapCharges = 21;
      const transactionCharges = 22;
      const totalDiscount = 23;
      const totalOrderValue = 24;
      const codCharges = 25;
      const prepaidAmount = 26;

      random_extra_charges(payload,
         orderCode,
          shippingCharges,
          giftWrapCharges,
          transactionCharges,
          totalDiscount,
          totalOrderValue,
          codCharges,
          prepaidAmount )
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);
        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });
    it(`should create an order with "Random Package Details" successfully`, async ()=>{
      const payload = JSON.parse(createOrderPayload());
      const orderCode = generateOrderCode();
      random_package_details(payload, orderCode);
      const expectedAssertions = getExpectedAssertions(orderCode);
      
      try {
        const response = await createOrder('create_order', payload);

        // Validate the response for the current payload and assertions
        validateCreateOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }
    });

  })

export { global_order_id };
