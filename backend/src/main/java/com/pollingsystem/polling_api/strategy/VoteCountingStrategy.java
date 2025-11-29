package com.pollingsystem.polling_api.strategy;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;

import java.util.Map;

public interface VoteCountingStrategy {
    Map<Option, Integer> countVotes(Poll poll);
}
