package com.pollingsystem.polling_api.domain;

import java.util.List;

public class Vote {
    private final String username;
    private final String ip;
    private final List<Option> selectedOptions;
    private final List<Option> rankedOptions;
    private int weight = 1;

    public Vote(String username, List<Option> selectedOptions, List<Option> rankedOptions, int weight, String ip) {
        this.username = username;
        this.selectedOptions = selectedOptions;
        this.rankedOptions = rankedOptions;
        this.weight = weight;
        this.ip = ip;
    }

    public String getUsername() { return username; }
    public List<Option> getSelectedOptions() { return selectedOptions; }
    public List<Option> getRankedOptions() { return rankedOptions; }
    public int getWeight() { return weight; }
    public String getIp() { return ip; }
}
