package com.pollingsystem.polling_api.decorator;

import com.pollingsystem.polling_api.domain.Poll;
import com.pollingsystem.polling_api.domain.Vote;

import java.time.LocalDateTime;

public class TimeLimitDecorator extends PollDecorator {
    private final LocalDateTime endTime;

    public TimeLimitDecorator(Poll wrappedPoll, LocalDateTime endTime) {
        super(wrappedPoll);
        this.endTime = endTime;
    }

    @Override
    public void addVote(Vote vote) {
        if (LocalDateTime.now().isAfter(endTime)) {
            throw new IllegalStateException("Poll voting period ended");
        }
        super.addVote(vote);
    }
}
