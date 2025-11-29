package com.pollingsystem.polling_api.factory;

import com.pollingsystem.polling_api.domain.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class PollFactory {
    public Poll createPoll(PollType type, String title, String description, List<Option> options) {
        String id = UUID.randomUUID().toString();

        switch (type) {
            case SINGLE_CHOICE:
                return new SingleChoicePoll(id, title, description, options);
            case MULTIPLE_CHOICE:
                return new MultipleChoicePoll(id, title, description, options);
            case RANKED_CHOICE:
                return new RankedChoicePoll(id, title, description, options);
            default:
                throw new IllegalArgumentException("Unknown PollType");
        }
    }
}
