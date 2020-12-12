package uz.pdp.workflow.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.workflow.entity.Payment;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @Query(value = "SELECT COALESCE(SUM(sum),0) FROM payment WHERE application_number=:applicationNumber", nativeQuery = true)
    double getPaidSumByProject(Integer applicationNumber);

    Payment findByApplicationNumber(Integer applicationNumber);
    List<Payment> findAllByApplicationNumber(Integer applicationNumber);

    Page<Payment> findAllByOrderByApplicationNumberDesc(Pageable pageable);

    Page<Payment> findAllByOrderByApplicationNumberAsc(Pageable pageable);

    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Payment> findAllByOrderByCreatedAtAsc(Pageable pageable);

    Page<Payment> findAllByDateBetween(Timestamp dan, Timestamp gacha, Pageable pageable);

    @Query(value = "select * from payment where cast(application_number as text) like CONCAT('%',:appNumber,'%')", nativeQuery = true)
    Page<Payment> getPaymentByAppNumber(@Param("appNumber") Integer appNumber,Pageable pageable);
}
