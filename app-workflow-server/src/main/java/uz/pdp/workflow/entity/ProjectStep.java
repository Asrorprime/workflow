package uz.pdp.workflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.template.AbsEntity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStep extends AbsEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Step step;

    private Timestamp deadline;

    private Timestamp startDate;

    private Timestamp completedDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "project_step_staff", joinColumns = {@JoinColumn(name = "project_step_id")},
            inverseJoinColumns = {@JoinColumn(name = "staff_id")})
    private List<Staff> staffs;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "projectStep", cascade = CascadeType.REMOVE)
    private List<SubStep> subSteps;

    private boolean stepByOrder;

    @ManyToOne
    private Project project;

    private boolean complete;

}
