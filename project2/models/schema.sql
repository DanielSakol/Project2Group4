/*DROP DATABASE IF EXISTS exampledb;
CREATE DATABASE exampledb;

DROP DATABASE IF EXISTS testdb;
CREATE DATABASE testdb;*/

CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT,
    first_name varchar(100) DEFAULT NULL,
    last_name varchar(100) DEFAULT NULL,
    email varchar(75) DEFAULT NULL,
    username varchar(100) DEFAULT NULL,
    userpassword varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
)


CREATE TABLE user_products (
    id int(11) NOT NULL AUTO_INCREMENT,
    user_id int(11) NOT NULL,
    product_id int(11) NOT NULL,
    favorite tinyint(1) DEFAULT NULL,
    product_name varchar(100) DEFAULT NULL,
    product_url varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
);