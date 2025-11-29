package com.pollingsystem.polling_api.validator;

import com.pollingsystem.polling_api.dto.VoteRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class OneOfTwoFieldsValidator implements ConstraintValidator<OneOfTwoFieldsRequired, VoteRequest> {
    @Override
    public boolean isValid(VoteRequest request, ConstraintValidatorContext context) {
        boolean hasSelected = request.selected != null && !request.selected.isEmpty();
        boolean hasRanked = request.ranked != null && !request.ranked.isEmpty();

        return hasSelected ^ hasRanked;
    }
}
