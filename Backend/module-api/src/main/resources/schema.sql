CREATE TABLE users (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       login_id VARCHAR(255) UNIQUE NOT NULL,
                       email VARCHAR(255) UNIQUE,
                       gender CHAR(1) NOT NULL,
                       birthdate DATE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       account VARCHAR(255),
                       account_number VARCHAR(255),
                       phone_number VARCHAR(255) UNIQUE NOT NULL,
                       refresh_token VARCHAR(255),
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(255) NOT NULL,
                       category VARCHAR(255),
                       phone_number VARCHAR(255),
                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       name VARCHAR(255) NOT NULL,
                       category VARCHAR(255) NOT NULL,
                       date DATETIME NOT NULL,
                       users_id INT NOT NULL,
                       create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       FOREIGN KEY (users_id) REFERENCES users(id)
);

CREATE TABLE users_relation (
                                users_id INT,
                                guest_id INT NOT NULL,
                                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT unique_users_guest UNIQUE (users_id, guest_id),
                                FOREIGN KEY (users_id) REFERENCES users(id),
                                FOREIGN KEY (guest_id) REFERENCES guest(id)
);

CREATE TABLE participation (
                               event_id INT NOT NULL,
                               guest_id INT NOT NULL,
                               amount INT,
                               create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT unique_users_guest UNIQUE (event_id, guest_id),
                               FOREIGN KEY (event_id) REFERENCES event(id),
                               FOREIGN KEY (guest_id) REFERENCES guest(id)
);

CREATE TABLE schedule (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          guest_id INT NOT NULL,
                          users_id INT NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          date DATETIME,
                          amount INT NOT NULL,
                          create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (guest_id) REFERENCES guest(id),
                          FOREIGN KEY (users_id) REFERENCES users(id)
);

CREATE TABLE account (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT NOT NULL,
                         account_number VARCHAR(50) NOT NULL,
                         balance BIGINT NOT NULL DEFAULT 0,
                         bank_code VARCHAR(20) NOT NULL,
                         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE payHistory (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            account_id INT NOT NULL,
                            amount BIGINT NOT NULL,
                            balance_after_transaction BIGINT NOT NULL,
                            transaction_type VARCHAR(10) NOT NULL,
                            counterparty_name VARCHAR(255) NOT NULL,
                            counterparty_account_number VARCHAR(50) NOT NULL,
                            description VARCHAR(255) NOT NULL,
                            transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (account_id) REFERENCES account(id)
);