package uz.pdp.workflow.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.User;
import uz.pdp.workflow.payload.ApiResponse;
import uz.pdp.workflow.payload.ReqSignUp;
import uz.pdp.workflow.repository.RoleRepository;
import uz.pdp.workflow.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    MessageSource messageSource;

    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
        return userRepository.findByPhoneNumber(phoneNumber).orElseThrow(() -> new UsernameNotFoundException(phoneNumber));
    }


    public UserDetails loadUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User id not found: " + userId));
    }


    public ApiResponse register(ReqSignUp reqSignUp) {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(reqSignUp.getPhoneNumber());
        if (optionalUser.isPresent()) {
            return new ApiResponse(messageSource.getMessage("phone.number.exist", null, LocaleContextHolder.getLocale()), false);
        } else {
            User user = new User(reqSignUp.getPhoneNumber(),
                    passwordEncoder.encode(reqSignUp.getPassword()),
                    reqSignUp.getFirstName(),
                    reqSignUp.getLastName(),
                    reqSignUp.getBirthDate(),
                    roleRepository.findAllById(reqSignUp.getRolesId()));
            userRepository.save(user);
            return new ApiResponse(messageSource.getMessage("user.created", null, LocaleContextHolder.getLocale()), true);
        }
    }


}
