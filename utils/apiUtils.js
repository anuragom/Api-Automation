import axios from 'axios';
import { baseURL, internal_base_url, external_apis_headers, token_headers } from '../utils/config.js';
import { loginURL, sellerPortalURL } from '../utils/config.js';

/**
 * Makes a POST request to create an order.
 * @param {Object} payload - The order payload to send in the request.
 * @returns {Promise} - Returns a promise with the API response.
 */


export async function loginToSellerPortal(payload) {
  return axios.post(`${loginURL}`, payload);
}

export async function getWalletBalance(endpoint,headers){
  return axios.get(`${internal_base_url}${endpoint}`,{headers})
}

export async function createOrder(endpoint, payload) {
  return axios.post(`${baseURL}/${endpoint}`, payload, {
    headers: external_apis_headers
  });
}

export async function bulk_order(endpoint, payload) {
  return axios.post(`${internal_base_url}/${endpoint}`, payload);
}

export async function get_orders_approval(endpoint, filter, logintoken) {
  console.log(`${internal_base_url}/${endpoint}?${filter}`);
  console.log('dkmfkfk', token_headers(logintoken));
  return axios.get(`${internal_base_url}/${endpoint}?${filter}`, {
    headers: token_headers(logintoken)
  });
}


export function mapAPIOrders(records) {
  return records.map(order => ({
    seller_order_id: order.seller_order_id,
    payment_method: order.payment_method,
    store_name: order.store_name,
    sku: order.sku,
    contact_name: order.contact_name,
    contact_details: order.contact_details,
    shipping_email: order.shipping_email,
    shipping_address: order.shipping_address,
    shipping_address_2: order.shipping_address_2,
    shipping_pin_code: order.shipping_pin_code,
    billing_name: order.billing_name,
    billing_email: order.billing_email,
    billing_phone: order.billing_phone,
    billing_address: order.billing_address,
    billing_address_2: order.billing_address_2,
    billing_pin_code: order.billing_pin_code,
    pickup_location: order.pickup_location,
    order_id: order.order_id
  }));
}


export function mapExcelOrders(validData) {
  return validData.map(order => ({
    seller_order_id: order['seller_order_id*'],
    channel_name: order['channel_name*'],
    payment_method: order['payment_method*'],
    buyer_shipping_name: order['buyer_shipping_name*'],
    buyer_shipping_email: order['buyer_shipping_email'],
    buyer_shipping_phone_country_code: order['buyer_shipping_phone_country_code'],
    buyer_shipping_phone: order['buyer_shipping_phone*'],
    buyer_shipping_address_line1: order['buyer_shipping_address_line1*'],
    buyer_shipping_address_line2: order['buyer_shipping_address_line2'],
    buyer_shipping_pincode: order['buyer_shipping_pincode*'],
    shipping_is_billing: order['shipping_is_billing'],
    buyer_billing_name: order['buyer_billing_name'],
    buyer_billing_email: order['buyer_billing_email'],
    buyer_billing_phone_country_code: order['buyer_billing_phone_country_code'],
    buyer_billing_phone: order['buyer_billing_phone'],
    buyer_billing_address_line1: order['buyer_billing_address_line1'],
    buyer_billing_address_line2: order['buyer_billing_address_line2'],
    buyer_billing_pincode: order['buyer_billing_pincode'],
    order_line_sku: order['order_line_sku'],
    order_line_product_name: order['order_line_product_name*'],
    order_line_qty: order['order_line_qty*'],
    order_line_hsn: order['order_line_hsn'],
    order_line_tax: order['order_line_tax'],
    order_line_selling_price_per_unit: order['order_line_selling_price_per_unit*'],
    shipping_charges_order_level: order['shipping_charges_order_level'],
    transaction_charges_order_level: order['transaction_charges_order_level'],
    gift_wrap_charges_order_level: order['gift_wrap_charges_order_level'],
    total_discount_order_level: order['total_discount_order_level'],
    prepaid_amount_order_level: order['prepaid_amount_order_level'],
    pickup_location: order['pickup_location*'],
  }));
}



export function compareOrders(arrRecords, excelOrder) {
  return arrRecords.find(apiOrder => (
    apiOrder.seller_order_id.trim().toLowerCase() === excelOrder.seller_order_id.trim().toLowerCase() &&
    apiOrder.payment_method.trim().toLowerCase() === excelOrder.payment_method.trim().toLowerCase() &&
    apiOrder.store_name.trim().toLowerCase() === excelOrder.channel_name.trim().toLowerCase() &&
    apiOrder.sku[0].trim().toLowerCase() === excelOrder.order_line_sku.trim().toLowerCase() &&
    apiOrder.contact_name.trim().toLowerCase() === excelOrder.buyer_shipping_name.trim().toLowerCase() &&
    apiOrder.shipping_email.trim().toLowerCase() === excelOrder.buyer_shipping_email.trim().toLowerCase() &&
    apiOrder.shipping_address.trim().toLowerCase() === excelOrder.buyer_shipping_address_line1.trim().toLowerCase() &&
    (apiOrder.shipping_address_2 || '').trim().toLowerCase() === (excelOrder.buyer_shipping_address_line2 || '').trim().toLowerCase() &&
    apiOrder.shipping_pin_code.toString().trim().toLowerCase() === excelOrder.buyer_shipping_pincode.toString().trim().toLowerCase() &&
    (apiOrder.billing_name || '').trim().toLowerCase() === (excelOrder.buyer_billing_name || '').trim().toLowerCase() &&
    (apiOrder.billing_email || '').trim().toLowerCase() === (excelOrder.buyer_billing_email || '').trim().toLowerCase() &&
    apiOrder.billing_address.trim().toLowerCase() === (excelOrder.buyer_billing_address_line1 || '').trim().toLowerCase() &&
    (apiOrder.billing_address_2 || '').trim().toLowerCase() === (excelOrder.buyer_billing_address_line2 || '').trim().toLowerCase() &&
    apiOrder.billing_pin_code.toString().trim().toLowerCase() === (excelOrder.buyer_billing_pincode || '').toString().trim().toLowerCase() &&
    apiOrder.pickup_location[0].trim().toLowerCase() === (excelOrder.pickup_location || '').trim().toLowerCase()
  ));
}



