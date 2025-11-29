package com.pollingsystem.polling_api.service;

import com.pollingsystem.polling_api.decorator.IPRestrictionDecorator;
import com.pollingsystem.polling_api.decorator.TimeLimitDecorator;
import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.factory.PollFactory;
import com.pollingsystem.polling_api.factory.PollType;
import com.pollingsystem.polling_api.repository.PollRepository;
import com.pollingsystem.polling_api.strategy.VoteCountingStrategy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PollService {
    private final PollRepository repository;
    private final PollFactory factory;

    public PollService(PollRepository repository, PollFactory factory) {
        this.repository = repository;
        this.factory = factory;
    }

    public Poll createPoll(String title, String description, List<Option> options, PollType type) {
        Poll poll = factory.createPoll(type, title, description, options);
        repository.save(poll);
        return poll;
    }

    public Poll applyTimeLimit(String pollId, LocalDateTime endTime) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        poll = new TimeLimitDecorator(poll, endTime);
        repository.save(poll);
        return poll;
    }

    public Poll applyIPRestriction(String pollId, java.util.Set<String> allowedIPs) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        poll = new IPRestrictionDecorator(poll, allowedIPs);
        repository.save(poll);
        return poll;
    }

    public void closePoll(String pollId) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        poll.close();
        repository.save(poll);
    }

    public List<Poll> listPolls() {
        return repository.findAll();
    }

    public Map<Option, Integer> getResults(String pollId, VoteCountingStrategy strategy) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        return poll.getResults(strategy);
    }
}
