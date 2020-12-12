package uz.pdp.workflow.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.pdp.workflow.entity.User;
import uz.pdp.workflow.entity.enums.RoleName;
import uz.pdp.workflow.repository.RoleRepository;
import uz.pdp.workflow.repository.UserRepository;

import java.util.Arrays;
import java.util.Date;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Value("${spring.datasource.initialization-mode}")
    private String initialMode;

    @Override
    public void run(String... args) throws Exception {
        if (initialMode.equals("always")) {
            userRepository.save(new User(
                    "1",
                    passwordEncoder.encode("1"),
                    "Ja'farbek",
                    "To'rayev",
                    new Date(),
                    roleRepository.findAll()
            ));
        }
    }
}
