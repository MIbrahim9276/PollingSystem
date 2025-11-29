package com.pollingsystem.polling_api.service;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.repository.PollRepository;
import com.pollingsystem.polling_api.strategy.VoteCountingStrategy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResultService {
    private final PollRepository repository;

    public ResultService(PollRepository repository) {
        this.repository = repository;
    }

    public Map<Option, Integer> computeResults(String pollId, VoteCountingStrategy strategy) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        return poll.getResults(strategy);
    }

    public List<Poll> listPolls() {
        return repository.findAll();
    }
}
