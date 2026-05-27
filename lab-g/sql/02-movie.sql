create table movie
(
    id          integer not null
        constraint movie_pk
            primary key autoincrement,
    title       text    not null,
    director    text    not null,
    year        integer not null,
    description text    not null,
    rating      integer
);
