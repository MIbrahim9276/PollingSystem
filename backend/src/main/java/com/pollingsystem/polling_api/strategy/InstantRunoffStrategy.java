package com.pollingsystem.polling_api.strategy;

import com.pollingsystem.polling_api.domain.Option;
import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;

import java.util.*;
import java.util.stream.Collectors;

public class InstantRunoffStrategy implements VoteCountingStrategy{
    @Override
    public Map<Option, Integer> countVotes(Poll poll) {
        List<Vote> votes = poll.getVotes();
        List<Option> options = new ArrayList<>(poll.getOptions());
        Map<Option, Integer> result = new HashMap<>();

        List<Option> active = options.stream().toList();
        while (active.size() > 1) {
            Map<Option, Integer> counts = options.stream()
                    .collect(Collectors.toMap(
                            option -> option,
                            option -> 0
                    ));

            for (Vote vote : votes) {
                for (Option candidate : vote.getRankedOptions()) {
                    if (active.contains(candidate)) {
                        counts.put(candidate, counts.get(candidate) + 1);
                        break;
                    }
                }
            }

            int totalActiveVotes = counts.values().stream().mapToInt(v -> v).sum();

            for (Option candidate : active) {
                if (counts.get(candidate) > totalActiveVotes / 2) {
                    result.put(candidate, votes.size());
                    return result;
                }
            }

            counts.entrySet().stream()
                    .min(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey).ifPresent(counts::remove);
        }

        result.put(active.getFirst(), votes.size());
        return result;
    }
}
