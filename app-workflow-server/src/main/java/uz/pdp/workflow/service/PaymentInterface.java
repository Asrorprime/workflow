package uz.pdp.workflow.service;

import uz.pdp.workflow.entity.Payment;
import uz.pdp.workflow.payload.*;

import java.util.UUID;

public interface PaymentInterface {
    ApiResponse addPayment(ReqPayment request);

    ResPayment getPayment(Payment payment);

    ResPageable getPayments(Integer page, Integer size, boolean sort);

    ResPageable getPaymentsDate(Integer page, Integer size, boolean dateSort);

    ApiResponse editPayment(ReqPayment request);

    ApiResponse deletePayment(UUID id);

    ResPageable getPaymentSearch(Integer page, Integer size, Integer appNumber);

}
