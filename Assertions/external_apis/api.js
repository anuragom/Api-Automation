import { expect } from 'chai';

/**
 * Validates the response from the Create Order API.
 * @param {Object} responseData - The response data object from the API.
 * @param {Array} expectedAssertions - An object of expected assertion
 */
export function validateCreateOrderResponse(responseData, expectedAssertions) {
  // Validate response structure
  expect(responseData).to.have.property('status');
  expect(responseData).to.have.property('order_id');
  expect(responseData).to.have.property('remarks');
  
  // validate the response
    expect(responseData.status).to.equal(expectedAssertions.status, expectedAssertions.statusMessage);
    expect(responseData.order_id).to.equal(expectedAssertions.orderId, expectedAssertions.orderIdMessage);
    expect(responseData.remarks).to.equal(expectedAssertions.remarks, expectedAssertions.remarksMessage);
}

export function validateLoginResponse(responseData, expectedAssertions){
   // Validate response structure
   expect(responseData).to.have.property('status');
   expect(responseData).to.have.property('token');
   expect(responseData).to.have.property('current_state');
   expect(responseData).to.have.property('agreement_flag');
   
   // validate the response
     expect(responseData.status).to.equal(expectedAssertions.status, expectedAssertions.statusMessage);
     expect(responseData.order_id).to.equal(expectedAssertions.orderId, expectedAssertions.orderIdMessage);
     expect(responseData.remarks).to.equal(expectedAssertions.remarks, expectedAssertions.remarksMessage);
}


export const validateBulkOrderResponse = async (responseData, expectedAssertions)=>{
  expect(responseData).to.have.property('status');
  expect(responseData).to.have.property('msg');
  
  expect(responseData.status).to.have(expectedAssertions.status, expectedAssertions.statusMessage);
  expect(responseData.msg).to.have(expectedAssertions.msg, expectedAssertions.msgMessage);
}
