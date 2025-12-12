package com.pollingsystem.polling_api.controller;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.dto.CreatePollRequest;
import com.pollingsystem.polling_api.repository.PollRepository;
import com.pollingsystem.polling_api.service.PollService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/polls")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class PollController {
    private final PollService service;
    private final PollRepository repository;

    public PollController(PollService service, PollRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Poll> createPoll(@Valid @RequestBody CreatePollRequest request) {
        List<Option> options = request.options.stream()
                .map(option -> new Option(UUID.randomUUID().toString(), option))
                .toList();
        Poll poll = service.createPoll(request.title, request.description, options, request.pollType);

        if (request.allowedIps != null && !request.allowedIps.isEmpty())
            service.applyIPRestriction(poll.getId(), new HashSet<>(request.allowedIps));
        if (request.endTime != null && !request.endTime.isEmpty())
            service.applyTimeLimit(poll.getId(), LocalDateTime.parse(request.endTime));

        return ResponseEntity.ok(poll);
    }

    @GetMapping
    public ResponseEntity<List<Poll>> getAllPolls() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poll> getPollById(@PathVariable String id) {
        return ResponseEntity.ok(repository.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> closePoll(@PathVariable String id) {
        service.closePoll(id);
        return ResponseEntity.ok().build();
    }
}
