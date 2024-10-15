/**
 * Generates expected assertions for the Create Order API response.
 * @param {string} orderCode - The generated order code for the assertions.
 * @returns {Array} - An array of expected assertion objects.
 */
// export function getExpectedAssertions(orderCode,index) {
//     const assertions =  [
//       //
//       {
//         status: 'SUCCESS',
//         orderId: orderCode,
//         remarks: 'order created successfully.',
//         statusMessage: 'Expected status to be SUCCESS',
//         orderIdMessage: 'Expected order ID to match the generated order code',
//         remarksMessage: 'Expected remarks to indicate order creation',
//       },
//       // 
//       {
//         status: 'SUCCESS',
//         orderId: orderCode,
//         remarks: 'order created successfully.',
//         statusMessage: 'Expected status to be Failure',
//         orderIdMessage: 'Expected order ID to match the generated order code',
//         remarksMessage: 'Expected remarks to indicate order creation failure',
//       },
//       // Exist pickup location
//       {
//         status: 'SUCCESS',
//         orderId: orderCode,
//         remarks: 'order created successfully.',
//         statusMessage: 'Expected status to be Failure',
//         orderIdMessage: 'Expected order ID to match the generated order code',
//         remarksMessage: 'Expected remarks to indicate order creation failure',
//       }
//     ];

//     return [assertions[index % assertions.length]];
//   }
  
export function getExpectedAssertions(orderCode) {
  return {
    status: 'SUCCESS',
    orderId: orderCode,
    remarks: 'order created successfully.',
    statusMessage: 'Expected status to be SUCCESS',
    orderIdMessage: 'Expected order ID to match the generated order code',
    remarksMessage: 'Expected remarks to indicate order creation'
  };
}


export function getExpectedAssertionsLogin() {
  return {
    status: true
  };
}
