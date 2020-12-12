package uz.pdp.workflow.entity;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import uz.pdp.workflow.entity.enums.RoleName;

import javax.persistence.*;

@Data
@Entity
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    @Enumerated(EnumType.STRING)
    private RoleName name;

    @Override
    public String getAuthority() {
        return name.name();
    }
}
