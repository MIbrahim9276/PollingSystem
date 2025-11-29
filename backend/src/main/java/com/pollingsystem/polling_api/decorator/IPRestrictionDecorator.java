package com.pollingsystem.polling_api.decorator;

import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;

import java.util.Set;

public class IPRestrictionDecorator extends PollDecorator{
    private final Set<String> allowedIPs;

    public IPRestrictionDecorator(Poll wrappedPoll, Set<String> allowedIPs) {
        super(wrappedPoll);
        this.allowedIPs = allowedIPs;
    }

    @Override
    public void addVote(Vote vote) {
        String ip = getIpFromVote(vote);
        if (!allowedIPs.contains(ip)) {
            throw new IllegalStateException("IP not allowed to vote");
        }
        super.addVote(vote);
    }

    private String getIpFromVote(Vote vote) {
        return vote.getIp();
    }
}
