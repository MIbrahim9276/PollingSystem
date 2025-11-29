package com.pollingsystem.polling_api.dto;

import com.pollingsystem.polling_api.validator.OneOfTwoFieldsRequired;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

@OneOfTwoFieldsRequired
public class VoteRequest {
    @NotBlank
    public String username;

    public List<String> selected;
    public List<String> ranked;

    public int weight = 1;

    @NotBlank
    @Pattern(regexp = "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
            message = "Invalid IPv4 address")
    public String ip;
}
