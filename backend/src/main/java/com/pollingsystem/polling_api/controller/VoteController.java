package com.pollingsystem.polling_api.controller;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;
import com.pollingsystem.polling_api.dto.VoteRequest;
import com.pollingsystem.polling_api.repository.PollRepository;
import com.pollingsystem.polling_api.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/polls/{pollId}/votes")
@CrossOrigin(origins = "http://localhost:5173")
@Validated
public class VoteController {
    private final VoteService service;
    private final PollRepository pollRepository;

    public VoteController(VoteService service, PollRepository pollRepository) {
        this.service = service;
        this.pollRepository = pollRepository;
    }

    @PostMapping
    public ResponseEntity<Void> submitVote(
            @PathVariable("pollId") String pollId,
            @Valid @RequestBody VoteRequest body,
            HttpServletRequest request
            ) {
        Poll poll = pollRepository.findById(pollId);
        if (poll == null) return ResponseEntity.badRequest().build();

        List<Option> selectedOptions = new ArrayList<>();
        if (body.selected != null && !body.selected.isEmpty()) {
            selectedOptions = body.selected.stream()
                    .map(id -> poll.getOptions().stream()
                            .filter(opt -> opt.getId().equals(id))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Invalid option ID: " + id))
                    ).toList();
        }

        List<Option> rankedOptions = new ArrayList<>();
        if (body.ranked != null && !body.ranked.isEmpty()) {
            rankedOptions = body.ranked.stream()
                    .map(id -> poll.getOptions().stream()
                            .filter(opt -> opt.getId().equals(id))
                            .findFirst()
                            .orElseThrow(() -> new IllegalArgumentException("Invalid option ID: " + id))
                    ).toList();
        }

        Vote vote = new Vote(body.username, selectedOptions, rankedOptions, body.weight, request.getRemoteAddr());
        service.addVote(pollId, vote);

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Integer> getVoteCount(
            @PathVariable("pollId") String id
    ) {
        return ResponseEntity.ok(service.getVoteCount(id));
    }
}
