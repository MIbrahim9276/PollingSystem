package com.pollingsystem.polling_api.decorator;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;
import com.pollingsystem.polling_api.strategy.VoteCountingStrategy;

import java.util.Map;

public abstract class PollDecorator extends Poll {
    protected Poll wrappedPoll;

    public PollDecorator(Poll wrappedPoll) {
        super(wrappedPoll.getId(), wrappedPoll.getTitle(), wrappedPoll.getDescription(), wrappedPoll.getOptions(), wrappedPoll.getPollType());
        this.wrappedPoll = wrappedPoll;
    }

    @Override
    public void addVote(Vote vote) {
        wrappedPoll.addVote(vote);
    }

    @Override
    public void close() {
        wrappedPoll.close();
    }

    @Override
    public Map<Option, Integer> getResults(VoteCountingStrategy strategy) {
        return wrappedPoll.getResults(strategy);
    }

    @Override
    public void validateVote(Vote vote) {
        wrappedPoll.validateVote(vote);
    }

    @Override
    public boolean isClosed() {
        return wrappedPoll.isClosed();
    }

    @Override
    public java.util.List<Vote> getVotes() {
        return wrappedPoll.getVotes();
    }
}
