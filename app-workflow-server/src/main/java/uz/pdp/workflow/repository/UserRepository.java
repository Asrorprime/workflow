package uz.pdp.workflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.workflow.entity.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByPhoneNumber(String phoneNumber);

    void deleteById(UUID uuid);
}
