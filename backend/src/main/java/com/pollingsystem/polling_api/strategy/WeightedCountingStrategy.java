package com.pollingsystem.polling_api.strategy;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WeightedCountingStrategy implements VoteCountingStrategy{
    @Override
    public Map<Option, Integer> countVotes(Poll poll) {
        Map<Option, Integer> results = new HashMap<>();
        List<Vote> votes = poll.getVotes();

        for (Option opt : poll.getOptions()) {
            results.put(opt, 0);
        }

        for (Vote v : votes) {
            List<Option> selected = v.getSelectedOptions();
            int weight = v.getWeight();
            if (selected != null && !selected.isEmpty()) {
                for (Option opt : selected) {
                    results.put(opt, results.get(opt) + weight);
                }
            }
        }

        return results;
    }
}
