package com.pollingsystem.polling_api.service;

import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;
import com.pollingsystem.polling_api.repository.PollRepository;
import org.springframework.stereotype.Service;

@Service
public class VoteService {
    private final PollRepository repository;

    public VoteService(PollRepository repository) {
        this.repository = repository;
    }

    public void addVote(String pollId, Vote vote) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        poll.addVote(vote);
        repository.save(poll);
    }

    public int getVoteCount(String pollId) {
        Poll poll = repository.findById(pollId);
        if (poll == null) throw new IllegalArgumentException("Poll not found");
        return poll.getVotes().size();
    }
}
