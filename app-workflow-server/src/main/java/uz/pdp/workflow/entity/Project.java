package uz.pdp.workflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.enums.ProjectStatus;
import uz.pdp.workflow.entity.template.AbsEntity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Project extends AbsEntity {

    @Column(unique = true, nullable = false)
    private Integer applicationNumber;

    private String name;

    private Timestamp startDate;

    private Timestamp endDate;

    private Timestamp deadline;

    private double price;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment contractFile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    private ProjectStatus projectStatus;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.REMOVE)
    private List<ProjectStep> projectSteps;

    private boolean byOrder;

    public Project(Integer applicationNumber,
                   String name,
                   Timestamp deadline,
                   double price,
                   Attachment contractFile,
                   Customer customer,
                   ProjectStatus projectStatus,
                   boolean byOrder) {
        this.applicationNumber = applicationNumber;
        this.name = name;
        this.deadline = deadline;
        this.price = price;
        this.contractFile = contractFile;
        this.customer = customer;
        this.projectStatus = projectStatus;
        this.byOrder = byOrder;
    }

    public String getStatusName(){
        return projectStatus.equals(ProjectStatus.NEW)?"Yangi":
                projectStatus.equals(ProjectStatus.IN_PROGRESS)?"Ish jarayonida":
                projectStatus.equals(ProjectStatus.COMPLETED)?"Yakunlangan":
                projectStatus.equals(ProjectStatus.CLOSED)?"Arxivlangan":"";
    }
}
