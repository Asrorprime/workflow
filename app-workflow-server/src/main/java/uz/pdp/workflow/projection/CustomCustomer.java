package uz.pdp.workflow.projection;

import org.springframework.data.rest.core.config.Projection;
import uz.pdp.workflow.entity.Customer;

import java.util.UUID;

@Projection(name = "CustomCustomer", types = Customer.class)
public interface CustomCustomer {
    UUID getId();

    String getCompanyName();

    String getFullName();

    String getPhoneNumber();

    String getAddress();

    String getAccount();

    String getBankName();

    String getDirector();

    String getTin();

    String getComment();

    String getStatus();
}
