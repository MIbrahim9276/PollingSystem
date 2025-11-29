package com.pollingsystem.polling_api.dto;

import com.pollingsystem.polling_api.factory.PollType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CreatePollRequest {
    @NotBlank
    public String title;

    public String description;

    public PollType pollType;

    @NotNull
    public List<String> options;

    public List<String> restrictedIps;
    public String endTime;
}
