package com.pollingsystem.polling_api.domain;

import com.pollingsystem.polling_api.factory.PollType;
import com.pollingsystem.polling_api.strategy.VoteCountingStrategy;

import java.util.List;
import java.util.Map;

public abstract class Poll {
    protected String id;
    protected String title;
    protected String description;
    protected List<Option> options;
    protected List<Vote> votes;
    protected PollType pollType;
    protected boolean isClosed = false;

    public Poll(String id, String title, String description, List<Option> options, PollType pollType) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.options = options;
        this.votes = new java.util.ArrayList<>();
        this.pollType = pollType;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public List<Option> getOptions() { return options; }
    public List<Vote> getVotes() { return votes; }
    public PollType getPollType() { return pollType; }
    public boolean isClosed() { return isClosed; }

    public void close() { this.isClosed = true; }

    public void addVote(Vote vote) throws IllegalStateException {
        if (isClosed) throw new IllegalStateException("Poll is closed");
        validateVote(vote);
        votes.add(vote);
    }

    public abstract void validateVote(Vote vote) throws IllegalArgumentException;

    public Map<Option, Integer> getResults(VoteCountingStrategy strategy) {
        return strategy.countVotes(this);
    }
}
