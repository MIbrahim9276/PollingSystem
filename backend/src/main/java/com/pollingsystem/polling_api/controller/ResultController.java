package com.pollingsystem.polling_api.controller;

import com.pollingsystem.polling_api.dto.ResultRequest;
import com.pollingsystem.polling_api.service.ResultService;
import com.pollingsystem.polling_api.strategy.FirstPastThePostStrategy;
import com.pollingsystem.polling_api.strategy.InstantRunoffStrategy;
import com.pollingsystem.polling_api.strategy.VoteCountingStrategy;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/polls/{pollId}/results")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class ResultController {
    private final ResultService service;

    public ResultController(ResultService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Integer>> getResults(
            @PathVariable("pollId") String id,
            @Valid @RequestBody ResultRequest request
            ) {
        VoteCountingStrategy strategy;
        switch (request.votingStrategy) {
            case "FIRST_PAST_THE_POST":
                strategy = new FirstPastThePostStrategy();
                break;
            case "INSTANT_RUNOFF":
                strategy = new InstantRunoffStrategy();
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        Map<String, Integer> mapped = service.computeResults(id, strategy).entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().getId(),
                        Map.Entry::getValue
                ));

        return ResponseEntity.ok(mapped);
    }
}
