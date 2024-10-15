
export function create_an_order(payload, orderCode) {
    return Object.assign(payload, {
      orderId: orderCode
    });
  }
  
export function exist_pickup_location(payload, orderCode, UAT_PICKUP_LOCATION) {
    return Object.assign(payload, {
      orderId: orderCode,
      pickupAddressName: UAT_PICKUP_LOCATION,
      orderItems: payload.orderItems.map((item, index) => ({
        ...item,
        pickupAddressName: index === 0 || index === 1 ? "" : item.pickupAddressName
      }))
    });
  }

  export function new_pickup_location(payload, orderCode, contact_name) {
    return Object.assign(payload, {
      orderId: orderCode,
      pickupLocation: {
        ...payload.pickupLocation,
        contactName: contact_name,
        pickupName: contact_name,
        pickupEmail: `${contact_name}@gmail.com`,
        pickupPhone: "9876543234",
        pickupAddress1: `address${contact_name}`,
        pinCode: "110001"
      },
      orderItems: payload.orderItems.map((item, index) => ({
        ...item,
        pickupAddressName: index === 0 || index === 1 ? "" : item.pickupAddressName
      }))
    });
  }

  export function billing_is_shipping_flag_false(payload, orderCode, billingIsShipping) {
    return Object.assign(payload, {
      orderId: orderCode,
      billingIsShipping: billingIsShipping
    });
  }

  export function new_item_name(payload, orderCode, item_name) {
    return Object.assign(payload, {
      orderId: orderCode,
      orderItems: payload.orderItems.map((item, index) => 
        index === 0 ? { ...item, itemName: item_name } : item
      )
    });
  }

  export function new_SKU(payload, orderCode, sku_name) {
    return Object.assign(payload, {
      orderId: orderCode,
      orderItems: payload.orderItems.map((item, index) => 
        index === 0 ? { ...item, sku: sku_name } : item
      )
    });
  }

  export function new_SKU_details(payload, orderCode, sku_name,description, units,unitPrice, tax, hsn,productLength, productBreadth,productHeight, productWeight,brand, imageURL) {
    return Object.assign(payload, {
      orderId: orderCode,
      orderItems: payload.orderItems.map((item, index) => 
        index === 0 ? { ...item,description: description,
            units: units,
            unitPrice: unitPrice,
            tax: tax,
            hsn: hsn,
            productLength: productLength,
            productBreadth: productBreadth,
            productHeight: productHeight,
            productWeight: productWeight,
            brand: brand,
            imageURL: imageURL,
            sku: sku_name } : item
      )
    });
  }

  export function prepaid_payment_method(payload, orderCode, paymentMethod) {
    return Object.assign(payload, {
      orderId: orderCode,
      paymentMethod: paymentMethod
    });
  }

  export function random_extra_charges(payload, orderCode, shippingCharges,giftWrapCharges,transactionCharges,totalDiscount,totalOrderValue,codCharges,prepaidAmount ) {
    return Object.assign(payload, {
      orderId: orderCode,
      shippingCharges: shippingCharges,
      giftWrapCharges: giftWrapCharges,
      transactionCharges: transactionCharges,
      totalDiscount: totalDiscount,
      totalOrderValue: totalOrderValue,
      codCharges: codCharges,
      prepaidAmount: prepaidAmount
    });
  }


export function random_package_details(payload, orderCode) {
    return Object.assign(payload, {
      orderId: orderCode,
      packageDetails: {
        ...payload.packageDetails,
        packageLength: 17,
        packageBreadth: 18,
        packageHeight: 19,
        packageWeight: 1.5
      }
    });
  }
  