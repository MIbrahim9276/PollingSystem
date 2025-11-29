package com.pollingsystem.polling_api.domain;

import com.pollingsystem.polling_api.factory.PollType;

import java.util.List;

public class MultipleChoicePoll extends Poll {
    public MultipleChoicePoll(String id, String title, String description, List<Option> options) {
        super(id, title, description, options, PollType.MULTIPLE_CHOICE);
    }

    @Override
    public void validateVote(Vote vote) throws IllegalArgumentException {
        if (vote.getSelectedOptions() == null || vote.getSelectedOptions().isEmpty()) {
            throw new IllegalArgumentException("Multiple choice poll requires at least one selected option.");
        }
        if (!options.containsAll(vote.getSelectedOptions())) {
            throw new IllegalArgumentException("Selected option(s) not in poll options.");
        }
    }
}
