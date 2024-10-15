// payload.js

//create order api
export function createOrderPayload(){
    return JSON.stringify(
        {
        "orderId": "",
        "orderDate": "2024-10-08",
        "pickupAddressName": "",
        "pickupLocation": {
        "contactName": "",
        "pickupName": "",
        "pickupEmail": "",
        "pickupPhone": "",
        "pickupAddress1": "",
        "pickupAddress2": "",
        "pinCode": ""
        },
        "storeName": "DEFAULT",
        "billingIsShipping": true,
        "shippingAddress": {
        "firstName": "Mass",
        "lastName": "test",
        "addressLine1": "Delhi",
        "addressLine2": "New Delhi",
        "pinCode": "110002",
        "email": "mahesh.mehra@rapidshyp.com",
        "phone": "8094723198"
        },
        "billingAddress": {
        "firstName": "Jane",
        "lastName": "Doe",
        "addressLine1": "456 Elm St",
        "addressLine2": "Apt 101",
        "pinCode": "110002",
        "email": "jane.doe@example.com",
        "phone": "9876543211"
        },
        "orderItems": [
        {
        "itemName": "Pete",
        "sku": "SKU21212",
        "description": "Description of product 1",
        "units": 1,
        "unitPrice": 10.0,
        "tax": 10.0,
        "hsn": "HSN123",
        "productLength": 10.0,
        "productBreadth": 5.0,
        "productHeight": 2.0,
        "productWeight": 1000,
        "brand": "Brand A",
        "imageURL": "http://example.com/product1.jpg",
        "isFragile": false,
        "isPersonalisable": false,
        // "pickupAddressName" :"Delihivery"
        "pickupAddressName" : "Second"
        },
        {
        "itemName": "Product 3",
        "sku": "SKU2121",
        "description": "Description of product 2",
        "units": 1,
        "unitPrice": 10.0,
        "tax": 10.0,
        "hsn": "HSN456",
        "productLength": 15.0,
        "productBreadth": 7.0,
        "productHeight": 3.0,
        "productWeight": 1000,
        "brand": "Brand B",
        "imageURL": "http://example.com/product2.jpg",
        "isFragile": true,
        "isPersonalisable": true,
        // "pickupAddressName" :"Delihivery"
        "pickupAddressName" : "Second"
        }
        ],
        "paymentMethod": "COD",
        "shippingCharges": 100.0,
        "giftWrapCharges": 10.0,
        "transactionCharges": 20.0,
        "totalDiscount": 5.0,
        "totalOrderValue": 0.0,
        "codCharges": 0.0,
        "prepaidAmount": 50.0,
        "packageDetails": {
        "packageLength": 20.0,
        "packageBreadth": 10.0,
        "packageHeight": 5.0,
        "packageWeight": 1000.0
    } 
  }
)
}

//approve order api
export function approveOrderPayload(orderCode,store_name){
    return JSON.stringify({
     "order_id":[orderCode],
     "store_name": store_name
  }
)
}

//assign awb  api
export function assignAWBPayload(shipment_id,courier_code){
  return JSON.stringify({
      "shipment_id":shipment_id,   
      "courier_code":courier_code
}
)
}

//pickup schedule
export function pickupSchedulePayload(shipment_id,awb){
  return JSON.stringify({
      "shipment_id":shipment_id,   
      "awb":awb
})
}

//de-allocate shipment
export function deallocatePayload(order_id,shipment_id){
  return JSON.stringify({
    "orderId": order_id,
    "shipmentId": shipment_id
})
}

//cancel order
export function cancel_order_payload(order_id,store_name){
  return JSON.stringify({
    "orderId": order_id,
    "storeName": store_name
})
}

//serviceability_check_payload
export function serviceability_check_payload(Pickup_pincode,Delivery_pincode,cod,total_order_value,weight){
  return JSON.stringify({
    "Pickup_pincode":Pickup_pincode,
    "Delivery_pincode":Delivery_pincode,
    "cod":cod,
    "total_order_value": total_order_value,
    "weight":weight
    })
}

//wrapper api
export function wrapperPayload(orderCode) {
  return JSON.stringify({
      "orderId": orderCode,
      "orderDate": "2024-10-09",
      // "pickupAddressName": "Delihivery",
      "pickupAddressName": "Second",
      "pickupLocation": {
          "contactName": "",
          "pickupName": "",
          "pickupEmail": "",
          "pickupPhone": "",
          "pickupAddress1": "",
          "pickupAddress2": "",
          "pinCode": ""
      },
      "storeName": "DEFAULT",
      "billingIsShipping": true,
      "shippingAddress": {
          "firstName": "Mahesh Mehra",
          "lastName": "EXT",
          "addressLine1": "Delhi",
          "addressLine2": "New Delhi",
          "pinCode": "110002",
          "email": "mahesh.mehra@rapidshyp.com",
          "phone": "8094723198"
      },
      "billingAddress": {
          "firstName": "Jane",
          "lastName": "Doe",
          "addressLine1": "456 Elm St",
          "addressLine2": "Apt 101",
          "pinCode": "110001",
          "email": "jane.doe@example.com",
          "phone": "9876543211"
      },
      "orderItems": [
          {
              "itemName": "Product 1",
              "sku": "SKU500",
              "description": "Description of product 1",
              "units": 5,
              "unitPrice": 10.0,
              "tax": 0.0,
              "hsn": "HSN123",
              "productLength": 10.0,
              "productBreadth": 5.0,
              "productHeight": 2.0,
              "productWeight": 0.5,
              "brand": "Brand A",
              "imageURL": "http://example.com/product1.jpg",
              "isFragile": false,
              "isPersonalisable": false
          },
          {
              "itemName": "Product 2",
              "sku": "SKU600",
              "description": "Description of product 2",
              "units": 2,
              "unitPrice": 20.0,
              "tax": 0.0,
              "hsn": "HSN456",
              "productLength": 15.0,
              "productBreadth": 7.0,
              "productHeight": 3.0,
              "productWeight": 0.8,
              "brand": "Brand B",
              "imageURL": "http://example.com/product2.jpg",
              "isFragile": true,
              "isPersonalisable": true
          }
      ],
      "paymentMethod": "COD",
      "shippingCharges": 100.0,
      "giftWrapCharges": 5,
      "transactionCharges": 5,
      "totalDiscount": 7,
      "totalOrderValue": 500.0,
      "codCharges": 15.0,
      "prepaidAmount": 50.0,
      "packageDetails": {
          "packageLength": 25.0,
          "packageBreadth": 15.0,
          "packageHeight": 10.0,
          "packageWeight": 3000.0
      }
  })
}

//label generation
export function label_generation_payload(shipment_id_array){
  return JSON.stringify({
    "shipmentId": shipment_id_array
})
}