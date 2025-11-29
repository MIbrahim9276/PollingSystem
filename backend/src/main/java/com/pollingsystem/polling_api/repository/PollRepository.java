package com.pollingsystem.polling_api.repository;

import com.pollingsystem.polling_api.domain.Poll;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PollRepository {
    private final Map<String, Poll> polls = new HashMap<>();

    public void save(Poll poll) {
        polls.put(poll.getId(), poll);
    }

    public Poll findById(String id) {
        return polls.get(id);
    }

    public List<Poll> findAll() {
        return new ArrayList<>(polls.values());
    }

    public void delete(String id) {
        polls.remove(id);
    }
}
