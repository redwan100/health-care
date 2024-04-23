import axios from "axios";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import { TPaymentData } from "./ssl.types";

const initPayment = async (paymentData: TPaymentData) => {
  try {
    const data = {
      store_id: config.payment.store_id,
      store_passwd: config.payment.store_pass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.payment.payment_success_url,
      fail_url: config.payment.payment_failed_url,
      cancel_url: config.payment.payment_cancel_url,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: "service",
      product_category: "N/A",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.contactNumber,
      cus_fax: "N/A",
      ship_name: "Customer Name",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };

    const response = await axios({
      method: "POST",
      url: config.payment.ssl_payment_url,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new ApiError(httpStatus.BAD_REQUEST, "payment error ocurred");
  }
};

const validPayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.payment.validation_url}?val_id=${payload.val_id}&store_id=${config.payment.store_id}&store_passwd=${config.payment.store_pass}&format=json`,
    });

    return response.data;
  } catch (err) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation failed!");
  }
};

export const SSLService = {
  initPayment,
  validPayment,
};
