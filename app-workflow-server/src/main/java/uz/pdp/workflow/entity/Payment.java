package uz.pdp.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.template.AbsEntity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class Payment extends AbsEntity {

    private Integer applicationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private PayType payType;

    private double sum;

    private Timestamp date;

}
