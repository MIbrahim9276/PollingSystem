package com.pollingsystem.polling_api.domain;

import com.pollingsystem.polling_api.factory.PollType;

import java.util.List;

public class SingleChoicePoll extends Poll {
    public SingleChoicePoll(String id, String title, String description, List<Option> options) {
        super(id, title, description, options, PollType.SINGLE_CHOICE);
    }

    @Override
    public void validateVote(Vote vote) throws IllegalArgumentException {
        if (vote.getSelectedOptions() == null || vote.getSelectedOptions().size() != 1) {
            throw new IllegalArgumentException("Single choice poll requires exactly one selected option.");
        }
        if (!options.containsAll(vote.getSelectedOptions())) {
            throw new IllegalArgumentException("Selected option(s) not in poll options.");
        }
    }
}
