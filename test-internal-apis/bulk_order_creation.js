import axios from 'axios';
import { expect } from 'chai';
import { seller_portal_login_Payload,bulk_order_create } from '../utils/payloads/payload.js';
import { generateOrderCode,generateContactName } from '../utils/functions/generate_order_code.js';
import { validateBulkOrderResponse } from '../Assertions/external_apis/api.js';
import { loginToSellerPortal,getWalletBalance,get_orders_approval,compareOrders,mapExcelOrders,mapAPIOrders } from '../utils/apiUtils.js';
import { getExpectedAssertionsLogin, getExpectedAssertionsInternalBulkActions } from '../utils/Assertions_data/create_order.js';
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

import { FetchExcelData } from '../helpers/excelReader.js';

let logintoken;
let order_ids_for_approval = [];
let shipment_ids_for_ship_now = [];
let wallet_balance;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Create Order API', () => {
    it(`should generate an login token`, async ()=>{

        const payload = JSON.parse(seller_portal_login_Payload());
        
        console.log(payload);
        const response = await loginToSellerPortal(payload);

        console.log(response.data);
        //store login token
        logintoken = response.data.token;
    })
     
    it(`should create orders in bulk`, async ()=>{
        const form = bulk_order_create();
        
        try {
          const response = await axios.post('https://uatapi.rapidshyp.com/session/orders/batch_orders', form, {
            headers: {
              'Authorization': `Bearer ${logintoken}`,
              ...form.getHeaders(),
            },
          });
      
          console.log('Response:', response.data);


          const msg = 'Bulk orders processed, please check the status of the orders.';
          const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

        // Validate the response for the current payload and assertions
        validateBulkOrderResponse(response.data, expectedAssertions);
      } catch (error) {
        console.error(`Error in payload`, error.response ? error.response.data : error.message);

        if (error.response) {
          expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
        } else {
          expect.fail(`Unexpected error at payload: ${error.message}`);
        }
      }

    })
    
    it(`should validate all the orders`, async ()=>{

      await delay(10000);

     const url = `https://uatapi.rapidshyp.com/session/orders/get_orders?page_no=0&order_status=APPROVAL_PENDING&date_filter=2024-09-28_2024-10-28&records_per_page=100`;
        
    const headers = {
        'Authorization': `Bearer ${logintoken}`,
        'Content-Type': 'application/json'
    };

    try {
      const apiOrders = await axios.get(url, { headers });
      const arrRecords = mapAPIOrders(apiOrders.data.records);
      console.log('Records from API:', arrRecords[0].order_id);
  
      const excelData = await FetchExcelData("C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv");
      const arr = mapExcelOrders(excelData.validData);
      const order_status = "APPROVAL_PENDING";
  
      arr.forEach(excelOrder => {
          const found = compareOrders(arrRecords, excelOrder);
  
          if (found) {
              order_ids_for_approval.push(found.order_id);
              console.log('Order Matched Approval Pending Tab:', excelOrder.seller_order_id);
          } else {
              console.log('Order not matched Approval Pending Tab:', excelOrder.seller_order_id);
          }
      });
  
      console.log("Order IDs for Approval:", order_ids_for_approval);
  
  } catch (error) {
      console.error('Error fetching data or comparing orders:', error);
  }
  
    
    })
     
    //should create shipments for auto_approved on prepaid orders
    //should create shipments for auto_approved on cod orders
    
    //validate using api of processing tab

    //use the same excel file to validate all the order cases
     
    
    
    
    //to validate the approve order api
    //hit the get api of approval_pending tab which i already done but just store the order ids in an array
    //create the payload of approve order api with these order ids
    //hit the approve order api
    //validate the response
    //delay for 1000 miliseconds
    //hit the get api of processing tab
    //validate the order details after approval


    it(`should approve the orders in bulk using approve order api`,async ()=>{
      
     const payload = {"order_ids":order_ids_for_approval,"approve_all_orders":false,"order_status":"APPROVAL_PENDING","date_filter":"2024-09-28_2024-10-28","order_id":"","name":"","email":"","phone":"","payment":"","sku":"","product_name":"","pickup_address_name":""}

      try {
        const response = await axios.post('https://uatapi.rapidshyp.com/session/sellers/approve_pending_orders', payload, {
          headers: {
            'Authorization': `Bearer ${logintoken}`
          },
        });
    
        console.log('Approval Response:', response.data);

     const msg = 'Order approval is in progress, please visit to activity logs for check status.';
     const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

      // Validate the response for the current payload and assertions
      validateBulkOrderResponse(response.data, expectedAssertions);
    } catch (error) {
      console.error(`Error in payload`, error.response ? error.response.data : error.message);

      if (error.response) {
        expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      } else {
        expect.fail(`Unexpected error at payload: ${error.message}`);
      }
    }


    })

    it(`should validate the approved orders inside the processing tab`, async ()=>{
      await delay(2000);
      
      const url = `https://uatapi.rapidshyp.com/session/orders/get_orders?page_no=0&order_status=PROCESSING&date_filter=2024-09-28_2024-10-28&records_per_page=100`;
        
      const headers = {
          'Authorization': `Bearer ${logintoken}`,
          'Content-Type': 'application/json'
      };
  
      try {
        const apiOrders = await axios.get(url, { headers });
        const arrRecords = apiOrders.data.records;
    
        const apiOrderIds = new Set(arrRecords.map(apiOrder => apiOrder.order_id));
    
        order_ids_for_approval.forEach(orderId => {
            if (apiOrderIds.has(orderId)) {
                console.log('Order Matched Processing Tab:', orderId);
            } else {
                console.log('Order not matched Processing Tab:', orderId);
            }
        });
    
    } catch (error) {
        console.error('Error fetching data or comparing orders:', error);
    }
    

    })

    //validate the shipment after order approval
    it(`should validate the shipment created inside created tab`, async ()=>{

      const url = `https://uatapi.rapidshyp.com/session/shipment/fetch_shipment?page_no=0&shipment_order_status=CREATED&date_filter=2024-07-28_2024-10-28&records_per_page=100&sort_by_field=LUT&sorting_order=DESCENDING`;
        
      const headers = {
          'Authorization': `Bearer ${logintoken}`,
          'Content-Type': 'application/json'
      };
  
      try {
        const apiOrders = await axios.get(url, { headers });
        const arrRecords = apiOrders.data.records;
    
        const apiOrderIds = new Set(arrRecords.map(apiOrder => apiOrder.order_id));
    
        order_ids_for_approval.forEach(orderId => {
            if (apiOrderIds.has(orderId)) {
              
                const matchedOrder = arrRecords.find(apiOrder => apiOrder.order_id === orderId);
                
                if (matchedOrder) {
                    shipment_ids_for_ship_now.push(matchedOrder._id);
                    console.log('Shipment Found for order id Created Tab:', orderId);
                }
            } else {
                console.log('Shipment not Found for order id Created Tab:', orderId);
            }
        });
    
    } catch (error) {
        console.error('Error fetching data or comparing orders:', error);
    }
    

    })

    //store the wallet balance
    it(`should store the wallet balance before ship now`, async () => {
      const headers = { 'Authorization': `Bearer ${logintoken}` };
      
      try {
          const response = await getWalletBalance('/payments/get_wallet_balance', headers);
        
          wallet_balance = response.data.amount;
          console.log(wallet_balance);
      } catch (error) {
          console.error('Error fetching wallet balance:', error.response ? error.response.data : error.message);
          throw error;
      }
  });

    //ship now shipments in bulk  assuming that all the dimensions are updated
    it(`should ship shipments in bulk`, async()=>{

      const payload = {"shipment_id":shipment_ids_for_ship_now,"process_all_shipments":false,"active_tab":"","date_filter":"2024-07-28_2024-10-28","order_id":"","name":"","email":"","phone":"","payment":"","awb_number":"","courier":"","status":"","channel":"","pickup_ids":null}

      try {
        const response = await axios.post('https://uatapi.rapidshyp.com/session/sellers/shipper/bulk_shipment_courier_allocation', payload, {
          headers: {
            'Authorization': `Bearer ${logintoken}`
          },
        });
    
        console.log('Approval Response:', response.data);
     const shipment_count = shipment_ids_for_ship_now.length;
     const msg = `${shipment_count} shipments are under process for courier assignment. Please check the status after some time.`;
     const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

      // Validate the response for the current payload and assertions
      validateBulkOrderResponse(response.data, expectedAssertions);
    } catch (error) {
      console.error(`Error in payload`, error.response ? error.response.data : error.message);

      if (error.response) {
        expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      } else {
        expect.fail(`Unexpected error at payload: ${error.message}`);
      }
    }

    })

    //validate the shipments details inside the assigned tab after the bulk ship now
    //right now only validating the shipment id
    it(`should validate the shipments details inside the assigned tab after bulk ship`, async()=>{
      await delay(5000);
      
      const url = `https://uatapi.rapidshyp.com/session/shipment/fetch_shipment?page_no=0&shipment_order_status=ASSIGNED&date_filter=2024-07-28_2024-10-28&records_per_page=100&sort_by_field=LUT&sorting_order=DESCENDING`;
        
      const headers = {
          'Authorization': `Bearer ${logintoken}`,
          'Content-Type': 'application/json'
      };
  
      try {
        const apiShipments = await axios.get(url, { headers });
        const arrRecords = apiShipments.data.records;
    
        const apiShipmentIds = new Set(arrRecords.map(apiOrder => apiOrder._id));
    
        shipment_ids_for_ship_now.forEach(shipmentId => {
            if (apiShipmentIds.has(shipmentId)) {
                console.log('Shipment Matched Assigned Tab:', shipmentId);
            } else {
                console.log('Shipment not matched Assigned Tab:', shipmentId);
            }
        });
    
    } catch (error) {
        console.error('Error fetching data or comparing orders:', error);
    }
    
    }) 

    //validate the wallet balance after bulk ship now
    //first calculate the freights using the rate calculator api and then subtract this with wallet_balance and again fetch the latest balance compare 
    //
    

    //Bulk Pickup Schedule 
    it(`should schedule pickup in bulk from assigned tab`, async()=>{
      
      const payload = {"shipment_id":shipment_ids_for_ship_now,"action_type":"SHIPMENT","process_all_shipments":false,"active_tab":"","date_filter":"2024-07-28_2024-10-28","order_id":"","name":"","email":"","phone":"","payment":"","awb_number":"","courier":"","status":"","channel":"","pickup_ids":null}

      try {
        const response = await axios.post('https://uatapi.rapidshyp.com/session/orders/schedule_pickup', payload, {
          headers: {
            'Authorization': `Bearer ${logintoken}`
          },
        });

     const msg = `The schedule pickup is currently in progress...`;
     const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

      // Validate the response for the current payload and assertions
      validateBulkOrderResponse(response.data, expectedAssertions);
    } catch (error) {
      console.error(`Error in payload`, error.response ? error.response.data : error.message);

      if (error.response) {
        expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      } else {
        expect.fail(`Unexpected error at payload: ${error.message}`);
      }
    }

    })


    //validate the pickup schedule shipment details inside Ready To Ship tab
    //currently only matching the shipment id
    it(`should validate the shipments details inside the ready to ship tab after bulk pickup schedule`, async()=>{
      await delay(5000);
      
      const url = `https://uatapi.rapidshyp.com/session/shipment/fetch_shipment?page_no=0&shipment_order_status=READY_TO_SHIP&date_filter=2024-07-28_2024-10-28&records_per_page=100&sort_by_field=LUT&sorting_order=DESCENDING`;
        
      const headers = {
          'Authorization': `Bearer ${logintoken}`,
          'Content-Type': 'application/json'
      };
  
      try {
        const apiShipments = await axios.get(url, { headers });
        const arrRecords = apiShipments.data.records;
    
        const apiShipmentIds = new Set(arrRecords.map(apiOrder => apiOrder._id));
    
        shipment_ids_for_ship_now.forEach(shipmentId => {
            if (apiShipmentIds.has(shipmentId)) {
                console.log('Shipment Matched Ready To Ship Tab:', shipmentId);
            } else {
                console.log('Shipment not matched Ready To Ship Tab:', shipmentId);
            }
        });
    
    } catch (error) {
        console.error('Error fetching data or comparing orders:', error);
    }
    
    })

    
    //create manifest in bulk
    it(`should manifest in bulk from ready to ship tab`, async()=>{
      
       
      const payload = {"shipment_id":shipment_ids_for_ship_now,"action_type":"SHIPMENT","process_all_shipments":false,"active_tab":"","date_filter":"2024-07-28_2024-10-28","order_id":"","name":"","email":"","phone":"","payment":"","awb_number":"","courier":"","status":"","channel":"","pickup_ids":null}

      try {
        const response = await axios.post('https://uatapi.rapidshyp.com/session/orders/create_manifest', payload, {
          headers: {
            'Authorization': `Bearer ${logintoken}`
          },
        });

     const msg = `The schedule pickup is currently in progress...`;
     const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

      // Validate the response for the current payload and assertions
      validateBulkOrderResponse(response.data, expectedAssertions);
    } catch (error) {
      console.error(`Error in payload`, error.response ? error.response.data : error.message);

      if (error.response) {
        expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      } else {
        expect.fail(`Unexpected error at payload: ${error.message}`);
      }
    }

    })
    

    //validate the status of the shipments after manifest creation using fetch shipment api inside ready to ship tab
     it(`should validate the status of shipments after manifest in bulk`, async ()=>{
      await delay(5000);
      
      const url = `https://uatapi.rapidshyp.com/session/shipment/fetch_shipment?page_no=0&shipment_order_status=READY_TO_SHIP&date_filter=2024-07-28_2024-10-28&records_per_page=100&sort_by_field=LUT&sorting_order=DESCENDING`;
        
      const headers = {
          'Authorization': `Bearer ${logintoken}`,
          'Content-Type': 'application/json'
      };
  
      try {
        const apiShipments = await axios.get(url, { headers });
        const arrRecords = apiShipments.data.records;
    
        const manifestedShipments = new Set(
            arrRecords
                .filter(apiOrder => apiOrder.shipment_order_status === "MANIFESTED")
                .map(apiOrder => apiOrder._id)
        );
        console.log("manifestedShipments",manifestedShipments);
        shipment_ids_for_ship_now.forEach(shipmentId => {
            if (manifestedShipments.has(shipmentId)) {
                console.log('Shipment Matched with manifested status Ready To Ship Tab:', shipmentId);
            } else {
                console.log('Shipment not matched with manifested status Ready To Ship Tab:', shipmentId);
            }
        });
    
    } catch (error) {
        console.error('Error fetching data or comparing shipments:', error);
    }
    


     })

     //hit one more api manifest download
     
     
     //de-allocate shipments in bulk
     it(`should de-allocate shipments after manifestation`, async ()=>{

      const payload = {"shipment_id":shipment_ids_for_ship_now,"action_type":"SHIPMENT","process_all_shipments":false,"active_tab":"","date_filter":"2024-07-28_2024-10-28","order_id":"","name":"","email":"","phone":"","payment":"","awb_number":"","courier":"","status":"","channel":"","pickup_ids":null}

      try {
        const response = await axios.post('https://uatapi.rapidshyp.com/session/sellers/shipper/bulk_shipment_courier_deallocation', payload, {
          headers: {
            'Authorization': `Bearer ${logintoken}`
          },
        });
     const shipment_count = shipment_ids_for_ship_now.length;
     const msg = `${shipment_count} shipments are under process for courier de-allocation. Please check the status after some time.`;
     const expectedAssertions = await getExpectedAssertionsInternalBulkActions(msg);

      // Validate the response for the current payload and assertions
      validateBulkOrderResponse(response.data, expectedAssertions);
    } catch (error) {
      console.error(`Error in payload`, error.response ? error.response.data : error.message);

      if (error.response) {
        expect.fail(`API request failed for payload with status: ${error.response.status}, data: ${JSON.stringify(error.response.data)}`);
      } else {
        expect.fail(`Unexpected error at payload: ${error.message}`);
      }
    }

     })
     

     //validate the de-allocated shipments using fetch shipment api inside created tab with status REALLOCATION REQUIRED
     

     
     



})