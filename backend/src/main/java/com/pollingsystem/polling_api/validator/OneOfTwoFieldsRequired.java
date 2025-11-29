package com.pollingsystem.polling_api.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = OneOfTwoFieldsValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface OneOfTwoFieldsRequired {
    String message() default "One of 'selected' or 'ranked' must be provided";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
