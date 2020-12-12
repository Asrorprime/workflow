package uz.pdp.workflow.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import uz.pdp.workflow.entity.User;
import uz.pdp.workflow.payload.*;
import uz.pdp.workflow.repository.UserRepository;
import uz.pdp.workflow.security.AuthService;
import uz.pdp.workflow.security.CurrentUser;
import uz.pdp.workflow.service.UserService;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {
    final UserRepository userRepository;
    final UserService userService;
    final PasswordEncoder passwordEncoder;
    final AuthService authService;

    public UserController(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder, AuthService authService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }


    @GetMapping("/me")
    public HttpEntity<?> getUser(@CurrentUser User user) {
        return ResponseEntity.ok(new ApiResponseModel(true, user));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PostMapping
    public HttpEntity<?> createUser(@RequestBody ReqSignUp reqUser) {
        ApiResponse response = userService.addUser(reqUser);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse(response.getMessage(), true));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse(response.getMessage(), false));
    }
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PutMapping("/changePassword")
    public HttpEntity<?> editPassword(@RequestBody ReqPassword reqPassword, @CurrentUser User user) {
        return userService.changePassword(reqPassword, user);
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @DeleteMapping("/{id}")
    public HttpEntity<?> deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Deleted", true));
    }

    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @GetMapping
    public HttpEntity<?> getUsers() {
        return ResponseEntity.ok(new ApiResponseModel(true, "Mana userlar", userService.getUsers()));
    }
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PutMapping("/edit")
    public HttpEntity<?> editUser(@RequestBody ReqUser reqUser, @CurrentUser User user) {
        return userService.editUser(reqUser, user);
    }
    @PreAuthorize("hasAnyRole('ROLE_MANAGER','ROLE_DIRECTOR')")
    @PutMapping("/edit/others")
    public HttpEntity<?> editUserOthers(@RequestBody ReqUser reqUser) {
        return userService.editUserOthers(reqUser);
    }


}
