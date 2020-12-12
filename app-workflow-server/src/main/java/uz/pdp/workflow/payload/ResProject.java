package uz.pdp.workflow.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.workflow.entity.Attachment;
import uz.pdp.workflow.entity.Customer;
import uz.pdp.workflow.entity.ProjectStep;
import uz.pdp.workflow.entity.Staff;
import uz.pdp.workflow.entity.enums.ProjectStatus;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResProject {
    private UUID projectId;

    private Integer applicationNumber;

    private String name;

    private String startDate;

    private String endDate;

    private String deadline;

    private double price;

    private Customer customer;

    private String customerName;

    private String customerStatus;

    private ProjectStatus projectStatus;

    private String status;

    private List<ResProjectStep> resProjectSteps;

    private boolean byOrder;

    private double leftOver;

    private double paidSum;

    private List<ResPayment> payments;

    private Integer staffsCount;

    public ResProject(Integer applicationNumber, String name, String startDate, String endDate, String deadline, double price, Customer customer, ProjectStatus projectStatus, String status, List<ResProjectStep> resProjectSteps, boolean byOrder) {
        this.applicationNumber = applicationNumber;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.deadline = deadline;
        this.price = price;
        this.customer = customer;
        this.projectStatus = projectStatus;
        this.status = status;
        this.resProjectSteps = resProjectSteps;
        this.byOrder = byOrder;
    }

    public ResProject(String name, double price, double leftOver, List<ResPayment> payments) {
        this.name = name;
        this.price = price;
        this.leftOver = leftOver;
        this.payments = payments;
    }

    public ResProject(Integer applicationNumber, double price, double leftOver) {
        this.applicationNumber = applicationNumber;
        this.price = price;
        this.leftOver = leftOver;
    }
}
