package uz.pdp.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.template.AbsEntity;

import javax.persistence.Column;
import javax.persistence.Entity;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@EqualsAndHashCode(callSuper = true)
public class Customer extends AbsEntity {

    @Column(unique = true, nullable = false)
    private String companyName;
    private String fullName;
    @Column(unique = true, nullable = false)
    private String phoneNumber;
    private String address;
    private String account;
    private String bankName;
    private String director;
    private String tin;
    private String comment;
    private String status;

}
