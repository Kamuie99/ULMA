create table users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       email VARCHAR(255) unique,
                       password VARCHAR(255) not null,
                       name VARCHAR(255) not null,
                       account VARCHAR(255),
                       account_number VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table guest (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(255) not null,
                       category VARCHAR(255),
                       phone_number VARCHAR(255),
                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table event (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(255) not null ,
                       category VARCHAR(255) not null ,
                       date DATETIME not null ,
                       users_id INT not null,
                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE event
    ADD CONSTRAINT fk_event_users_id FOREIGN KEY (users_id) REFERENCES users(id);

CREATE TABLE users_relation (
                                users_id INT not null ,
                                guest_id INT not null ,
                                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT unique_users_guest UNIQUE (users_id, guest_id)
);

ALTER TABLE users_relation
    ADD CONSTRAINT fk_users_relation_users_id FOREIGN KEY (users_id) REFERENCES users(id);

ALTER TABLE users_relation
    ADD CONSTRAINT fk_users_relation_guest_id FOREIGN KEY (guest_id) REFERENCES guest(id);

CREATE TABLE participation (
                               event_id INT not null ,
                               guest_id INT not null ,
                               amount INT ,
                               create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT unique_users_guest UNIQUE (event_id, guest_id)
);

ALTER TABLE participation
    ADD CONSTRAINT fk_users_participation_event_id FOREIGN KEY (event_id) REFERENCES event(id);

ALTER TABLE participation
    ADD CONSTRAINT fk_users_participation_guest_id FOREIGN KEY (guest_id) REFERENCES guest(id);

CREATE TABLE schedule (
                          id INT primary key AUTO_INCREMENT,
                          guest_id INT not null ,
                          users_id INT not null ,
                          name VARCHAR(255) not null ,
                          date DATETIME ,
                          amount INT not null,
                          create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE schedule
    ADD CONSTRAINT fk_schedule_guest_id FOREIGN KEY (guest_id) REFERENCES guest(id);
ALTER TABLE schedule
    ADD CONSTRAINT fk_schedule_users_id FOREIGN KEY (users_id) REFERENCES guest(id);

CREATE TABLE pay (
                     id INT PRIMARY KEY AUTO_INCREMENT,
                     users_id INT not null,
                     create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE pay
    ADD CONSTRAINT fk_pay_users_id FOREIGN KEY (users_id) REFERENCES users(id);

CREATE TABLE pay_history (
                             id INT PRIMARY KEY AUTO_INCREMENT,
                             pay_id INT not null ,
                             category VARCHAR(255) not null ,
                             amount INT not null
);

ALTER TABLE pay_history
    ADD CONSTRAINT fk_pay_history_pay_id FOREIGN KEY (pay_id) REFERENCES pay(id);


ALTER TABLE users
    ADD COLUMN login_id VARCHAR(255) UNIQUE NOT NULL AFTER id;

ALTER TABLE users
    ADD COLUMN phone_number VARCHAR(255) UNIQUE NOT NULL;

ALTER TABLE users
    ADD COLUMN refresh_token VARCHAR(255);

ALTER TABLE users
    ADD COLUMN user_key VARCHAR(255);

alter table users
    add column account_verified char(1) default 'N';

ALTER TABLE users
    ADD COLUMN gender CHAR(1) NOT NULL,
ADD COLUMN birthdate DATE NOT NULL;