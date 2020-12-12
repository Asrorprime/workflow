package uz.pdp.workflow.service;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uz.pdp.workflow.entity.User;
import uz.pdp.workflow.exception.ResourceNotFoundException;
import uz.pdp.workflow.payload.ApiResponse;
import uz.pdp.workflow.payload.ReqPassword;
import uz.pdp.workflow.payload.ReqSignUp;
import uz.pdp.workflow.payload.ReqUser;
import uz.pdp.workflow.repository.AttachmentRepository;
import uz.pdp.workflow.repository.RoleRepository;
import uz.pdp.workflow.repository.UserRepository;
import uz.pdp.workflow.security.JwtTokenProvider;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    final UserRepository userRepository;
    final RoleRepository roleRepository;
    final PasswordEncoder passwordEncoder;
    final MessageSource messageSource;
    final JwtTokenProvider jwtTokenProvider;
    final AttachmentRepository attachmentRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, MessageSource messageSource, JwtTokenProvider jwtTokenProvider, AttachmentRepository attachmentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.messageSource = messageSource;
        this.jwtTokenProvider = jwtTokenProvider;
        this.attachmentRepository = attachmentRepository;
    }

    public ApiResponse addUser(ReqSignUp request) {
        if (!userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            User user = new User(
                    request.getPhoneNumber(),
                    passwordEncoder.encode("1"),
                    request.getFirstName(),
                    request.getLastName(),
                    request.getBirthDate(),
                    roleRepository.findAllById(request.getRolesId())
            );
            if (request.getPhotoId() != null) {
                user.setPhoto(attachmentRepository.findById(request.getPhotoId()).orElseThrow(() -> new ResourceNotFoundException("user/add", "id", request.getPhotoId())));
            }
            userRepository.save(user);
            return new ApiResponse("Foydalanuvchi ro'yxatga olindi", true);
        }
        return new ApiResponse("Bunday telefon raqamli foydalanuvchi mavjud", false);
    }

    public HttpEntity<?> editUser(ReqUser reqUser, User user) {
        ApiResponse response = new ApiResponse();
        response.setSuccess(true);
        user.setFirstName(reqUser.getFirstName());
        user.setLastName(reqUser.getLastName());
        user.setBirthDate(reqUser.getBirthDate());
        if (reqUser.getPhotoId() != null) {
            user.setPhoto(attachmentRepository.findById(reqUser.getPhotoId()).orElseThrow(() -> new ResourceNotFoundException("user/edit", "id", reqUser.getPhotoId())));
        }
        if (!user.getPhoneNumber().equals(reqUser.getPhoneNumber())) {
            if (!userRepository.findByPhoneNumber(reqUser.getPhoneNumber()).isPresent()) {
                user.setPhoneNumber(reqUser.getPhoneNumber());
            } else {
                response.setSuccess(false);
                response.setMessage("Bunday telefon raqamli foydalanuvchi mavjud");
            }
        }
        if (response.isSuccess()) {
            response.setMessage("Foydalanuvchining malumotlari o'zgartirildi");
        } else {
            response.setMessage("Tahrirlashda xatolik");
        }
        userRepository.save(user);
        return ResponseEntity.ok(response);
    }

    public ResponseEntity changePassword(ReqPassword request, User user) {
        if (request.getPassword().equals(request.getPrePassword())) {
            if (checkPassword(request.getOldPassword(), user)) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                userRepository.save(user);
                String jwt = jwtTokenProvider.generateToken1(user);
                return ResponseEntity.status(HttpStatus.ACCEPTED).body(new ApiResponse(jwt, true));
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Hozirgi parol xato", false));
            }
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Yangi va tasdiqlovchi parol mos emas", false));
        }
    }

    private Boolean checkPassword(String oldPassword, User user) {
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    public List<User> getUsers() {
        return userRepository.findAll().stream().filter(user -> user.getRoles().size() < 3).collect(Collectors.toList());
    }

    public HttpEntity<?> editUserOthers(ReqUser reqUser) {
        ApiResponse response = new ApiResponse();
        response.setSuccess(true);
        User user = userRepository.findById(reqUser.getId()).orElseThrow(() -> new ResourceNotFoundException("user/edit", "id", reqUser.getId()));
        user.setFirstName(reqUser.getFirstName());
        user.setLastName(reqUser.getLastName());
        user.setBirthDate(reqUser.getBirthDate());
        user.setRoles(roleRepository.findAllById(reqUser.getRolesId()));
        if (reqUser.getPhotoId() != null) {
            user.setPhoto(attachmentRepository.findById(reqUser.getPhotoId()).orElseThrow(() -> new ResourceNotFoundException("user/edit", "id", reqUser.getPhotoId())));
        }
        if (!user.getPhoneNumber().equals(reqUser.getPhoneNumber())) {
            if (!userRepository.findByPhoneNumber(reqUser.getPhoneNumber()).isPresent()) {
                user.setPhoneNumber(reqUser.getPhoneNumber());
            } else {
                response.setSuccess(false);
                response.setMessage("Bunday telefon raqamli foydalanuvchi mavjud");
            }
        }
        if (response.isSuccess()) {
            response.setMessage("Foydalanuvchining malumotlari o'zgartirildi");
        } else {
            response.setMessage("Tahrirlashda xatolik");
        }
        userRepository.save(user);
        return ResponseEntity.ok(response);
    }
}
