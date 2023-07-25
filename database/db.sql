CREATE DATABASE database_contact;

use database_contact;

CREATE Table users(

id INT(11) NOT NULL,
username VARCHAR(16) not NULL, 
password VARCHAR (60) not NULL,
fullname VARCHAR(100) not NULL

);

alter Table users 
    add PRIMARY KEY(id);

alter Table users
modify id int(11) not NULL auto_increment, auto_increment =2;

describe users;


-- links table
create table contact(
id int(11) not null,
nameContacto varchar(150) not null,
tlf VARCHAR(11) not null,
correo varchar(150) not null,
description text,
user_id int(11),
created_at timestamp not null DEFAULT current_timestamp,
constraint fk_user FOREIGN KEY (user_id) REFERENCES users(id)

);

ALTER Table contact
add PRIMARY KEY(id);

ALTER Table contact
modify id int (11) not null auto_increment, auto_increment = 2;

describe contact;
