package uz.pdp.workflow.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import uz.pdp.workflow.entity.template.AbsNameEntity;

import javax.persistence.Entity;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Step extends AbsNameEntity {
}
