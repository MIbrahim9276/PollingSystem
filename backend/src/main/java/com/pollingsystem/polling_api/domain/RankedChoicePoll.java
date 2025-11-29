package com.pollingsystem.polling_api.domain;

import com.pollingsystem.polling_api.factory.PollType;

import java.util.HashSet;
import java.util.List;

public class RankedChoicePoll extends Poll {
    public RankedChoicePoll(String id, String title, String description, List<Option> options) {
        super(id, title, description, options, PollType.RANKED_CHOICE);
    }

    @Override
    public void validateVote(Vote vote) throws IllegalArgumentException {
        List<Option> ranked = vote.getRankedOptions();
        if (ranked == null || ranked.isEmpty()) {
            throw new IllegalArgumentException("Ranked choice poll requires ranked options.");
        }
        if (!options.containsAll(ranked)) {
            throw new IllegalArgumentException("Ranked option(s) not in poll options.");
        }
        if (new HashSet<>(ranked).size() != ranked.size()) {
            throw new IllegalArgumentException("Duplicate options in ranked list.");
        }
    }
}
