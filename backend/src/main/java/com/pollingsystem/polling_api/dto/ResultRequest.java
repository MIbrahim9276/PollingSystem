package com.pollingsystem.polling_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ResultRequest {
    @NotBlank
    @Pattern(
            regexp = "FIRST_PAST_THE_POST|INSTANT_RUNOFF",
            message = "Must be one of FIRST_PAST_THE_POST or INSTANT_RUNOFF"
    )
    public String votingStrategy;
}
