package com.pollingsystem.polling_api.domain;

public class Option {
    private final String id;
    private final String text;

    public Option(String id, String text) {
        this.id = id;
        this.text = text;
    }

    public String getId() { return id; }
    public String getText() { return text; }
}
