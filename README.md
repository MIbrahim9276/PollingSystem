# Polling System – Backend (Java / Spring Boot)

A modular, extensible backend for creating polls, voting, and calculating results using multiple strategies.
The system demonstrates Factory, Decorator, and Strategy design patterns as required by the course project.

## Features

- Create polls (single-choice, multi-choice, ranked-choice)
- Submit votes with username + IP tracking
- Count results using pluggable strategies
- Decorators for optional poll restrictions:
    - Time-limit
    - IP-restriction
- RESTful API backend ready for frontend integration
- In-memory repository (can be swapped later)

## Project Structure
src/main/java/com/project/polling/
│
├── controller/
│   ├── PollController.java
│   ├── VoteController.java
│   └── ResultController.java
│
├── service/
│   ├── PollService.java
│   ├── VoteService.java
│   └── ResultService.java
│
├── repository/
│   └── PollRepository.java
│
├── dto/
│   ├── CreatePollRequest.java
│   ├── VoteRequest.java
│   └── ResultRequest.java
│
├── domain/
│   ├── Poll.java
│   ├── Option.java
│   ├── Vote.java
│   ├── SingleChoicePoll.java
│   ├── MultipleChoicePoll.java
│   ├── RankedChoicePoll.java
│
├── patterns/
│   ├── factory/
│   │   ├── PollFactory.java
│   │   └── PollType.java
│   │
│   ├── decorator/
│   │   ├── PollDecorator.java
│   │   ├── TimeLimitDecorator.java
│   │   └── IpRestrictionDecorator.java
│   │
│   ├── strategy/
│       ├── VoteCountingStrategy.java
│       ├── FirstPastThePostStrategy.java
│       └── InstantRunoffStrategy.java
│
└── Application.java

## Design Patterns Used
1. Factory Pattern — PollFactory

Used to create different poll types dynamically:
- SINGLE_CHOICE
- MULTIPLE_CHOICE
- RANKED_CHOICE

2. Decorator Pattern — PollDecorator

Adds optional behavior:
- Time-limit for voting
- IP-restriction

3. Strategy Pattern — VoteCountingStrategy

Pluggable result-counting algorithms:
- First-Past-The-Post
- Instant Runoff (Ranked Choice)

## REST API Overview
Polls
POST /polls
GET  /polls
GET  /polls/{id}
DELETE /polls/{id}

Votes
POST /polls/{id}/vote
GET  /polls/{id}/votes

Results
POST /api/polls/{id}/results


Votes include:
- username
- selected option IDs
- ranked option IDs
- IP (captured automatically or provided)

## Running the Project
### Requirements
- Java 17+
- Maven or Gradle
- Spring Boot 3.x

### Run
`mvn spring-boot:run`

### Server starts on:
`http://localhost:8080`
