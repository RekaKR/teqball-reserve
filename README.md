# Teqball reserve

## Story

You have just played [teqball](https://www.youtube.com/watch?v=kmCDd7goWtE) for the first time, and immediately fell in love with the game. 
You could organize your games on facebook, but it is just way too mainstream. 
Since you can code a web application you have decided to do it. 
Users could use google for login, they see a screen where they can team up with their friends, and an other screen, where they can organize events - possible with a venue added, and shown on integrated map. 
How hard can it be?

## What are you going to learn?

OAuth
Google calendar API
Role, permission and group handling

## Tasks

1. Create a frontend application, and a user service. A user should be able to login with google, and receive an app specific jwt token in return from the user service. Users should be able to form groups, and groups should be able to organize events.
    - Users can log in with google
    - When login is successful, the user receives an app specific jwt token. This token contains app specific permissions as well.
    - Every user should be able to create groups, and appoint admins for these groups. Admins should be able to create events for the groups. For these events any group member should be able to respond. Users who are not the member of a group should not see the group's events.

2. Users should be able to authorize the app to write into their calendar, so that whenever they are invited to an event it appears in their google calendar as well.
    - The event appears in the google calendar when a user is invited to it.

3. Admins should be able to add venues to the events. These venues should appear with the help of google maps.
    - A map appears for the event with the location shown on it.

## General requirements

- The frontend app is an SPA created with react.
- Secret keys appear only on the backend, and only through environment variables.

## Hints

- Construct your own models for role, permission and group handling.

- Store the permissions in the JWT, that way you can use it on both the frontend and the backend.

- Do NOT store the secret for the JWT on the frontend - remember, you can _decode_ it on the frontend without it.

- Do NOT accept the JWT payload on the backend without validating it - _decoding_ it is not enough on the backend.

## Background materials

- <i class="far fa-book-open"></i> [Google Calendar API](https://developers.google.com/calendar/overview)
