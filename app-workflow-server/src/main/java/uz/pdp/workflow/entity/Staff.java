package uz.pdp.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.template.AbsEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import java.sql.Date;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff extends AbsEntity {
    private String firstName;
    private String lastName;
    private String middleName;
    private String address;
    private String phoneNumber;
    @OneToOne(fetch = FetchType.LAZY)
    private Attachment photo;
    @Column(length = 510)
    private String description;
    @OneToOne(fetch = FetchType.LAZY)
    private Specialty specialty;

}
