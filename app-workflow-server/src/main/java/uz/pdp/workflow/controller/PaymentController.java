package uz.pdp.workflow.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.workflow.entity.Payment;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ApiResponse;
import uz.pdp.workflow.payload.ReqPayment;
import uz.pdp.workflow.repository.PaymentRepository;
import uz.pdp.workflow.service.PaymentService;
import uz.pdp.workflow.utils.AppConstants;

import java.util.UUID;

@PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    public PaymentController(PaymentRepository paymentRepository, PaymentService paymentService) {
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }

    @PostMapping
    public HttpEntity<?> addPayment(@RequestBody ReqPayment request) {
        return ResponseEntity.ok(paymentService.addPayment(request));
    }

    @GetMapping("/{id}")
    public HttpEntity<?> getPayment(@PathVariable UUID id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("getPayment", "id", id));
        return ResponseEntity.ok(paymentService.getPayment(payment));
    }

    @GetMapping
    public HttpEntity<?> getPayments(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
                                     @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size,
                                     @RequestParam(value = "sort", defaultValue = "false") boolean sort){
        return ResponseEntity.ok(paymentService.getPayments(page, size, sort));
    }

    @GetMapping("/sortDate")
    public HttpEntity<?> getPaymentsDate(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size,
                                         @RequestParam(value = "dateSort", defaultValue = "false") boolean dateSort) {
        return ResponseEntity.ok(paymentService.getPaymentsDate(page, size, dateSort));
    }

    @PutMapping
    public HttpEntity<?> editPayment(@RequestBody ReqPayment request) {
        return ResponseEntity.accepted().body(paymentService.editPayment(request));
    }

    @GetMapping("/search")
    public HttpEntity<?> getPaymentSearch(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
                                          @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size,
                                          @RequestParam(value = "appNumber", defaultValue = "") Integer appNumber){
        return ResponseEntity.ok(paymentService.getPaymentSearch(page, size, appNumber));
    }



    @DeleteMapping("{id}")
    public ApiResponse deletePayment(@PathVariable UUID id) {
        ApiResponse response = paymentService.deletePayment(id);
        if (response.isSuccess()) {
            return new ApiResponse(response.getMessage(), true);
        } else {
            return new ApiResponse(response.getMessage(), false);
        }
    }
}
