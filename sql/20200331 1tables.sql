-- Generated by Oracle SQL Developer Data Modeler 19.2.0.182.1216
--   at:        2020-03-31 10:04:23 PDT
--   site:      Oracle Database 11g
--   type:      Oracle Database 11g



CREATE TABLE meta (
    profile_username   VARCHAR(300) NOT NULL,
    title              VARCHAR(300) NOT NULL,
    description        VARCHAR(2000) NOT NULL,
    created            DATE NOT NULL,
    updated            DATE NOT NULL,
    views              INTEGER
);

ALTER TABLE meta ADD CONSTRAINT meta_pk PRIMARY KEY ( profile_username,
                                                      title );

CREATE TABLE opinion (
    id                 INTEGER NOT NULL,
    prompt             VARCHAR(1000) NOT NULL,
    created            DATE NOT NULL,
    updated            DATE NOT NULL,
    question_id        INTEGER NOT NULL,
    profile_username   VARCHAR(300) NOT NULL,
    description        VARCHAR(3000)
);

ALTER TABLE opinion
    ADD CONSTRAINT opinion_pk PRIMARY KEY ( id );

CREATE TABLE option_meta (
    opinion_id                 INTEGER NOT NULL,
    opinion_question_id        INTEGER NOT NULL,
    opinion_profile_username   VARCHAR(300) NOT NULL,
    status_profile_username    VARCHAR(300) NOT NULL,
    status_title               VARCHAR(300) NOT NULL
);

CREATE TABLE option_tag (
    opinion_id                 INTEGER NOT NULL,
    opinion_question_id        INTEGER NOT NULL,
    opinion_profile_username   VARCHAR(300) NOT NULL,
    tag_profile_username       VARCHAR(300) NOT NULL,
    tag_name                   VARCHAR(1000) NOT NULL
);

CREATE TABLE profile (
    username      VARCHAR(300) NOT NULL,
    password      CHAR(128),
    salt          CHAR(32),
    created       DATE NOT NULL,
    updated       DATE NOT NULL,
    body          VARCHAR(10000) NOT NULL,
    description   VARCHAR(3000) NOT NULL
);

ALTER TABLE profile ADD CONSTRAINT profile_pk PRIMARY KEY ( username );

CREATE TABLE profile_tag (
    profile_username       VARCHAR(300) NOT NULL,
    tag_profile_username   VARCHAR(300) NOT NULL,
    tag_name               VARCHAR(1000) NOT NULL
);

CREATE TABLE profile_meta (
    profile_username          VARCHAR(300) NOT NULL,
    status_profile_username   VARCHAR(300) NOT NULL,
    status_title              VARCHAR(300) NOT NULL
);

CREATE TABLE question (
    id                 INTEGER NOT NULL,
    prompt             VARCHAR(3000) NOT NULL,
    description        VARCHAR(10000) NOT NULL,
    created            DATE NOT NULL,
    updated            DATE NOT NULL,
    profile_username   VARCHAR(300) NOT NULL
);

ALTER TABLE question ADD CONSTRAINT question_pk PRIMARY KEY ( id );

CREATE TABLE question_meta (
    question_id               INTEGER NOT NULL,
    status_profile_username   VARCHAR(300) NOT NULL,
    status_title              VARCHAR(300) NOT NULL
);

CREATE TABLE question_tag (
    question_id     INTEGER NOT NULL,
    tag_username1   VARCHAR(300) NOT NULL,
    tag_name        VARCHAR(1000) NOT NULL
);

CREATE TABLE tag (
    name                            VARCHAR(1000) NOT NULL,
    description                     VARCHAR(10000) NOT NULL,
    created                         DATE NOT NULL,
    updated                         DATE NOT NULL,
    profile_username                VARCHAR(300) NOT NULL,
    vote_id                         INTEGER,
    vote_opinion_id                 INTEGER,
    vote_opinion_id1                INTEGER,
    vote_opinion_profile_username   VARCHAR(300),
    vote_profile_username           VARCHAR(300),
    vote_question_id                INTEGER
);

CREATE TABLE tag_meta (
    tag_profile_username      VARCHAR(300) NOT NULL,
    tag_name                  VARCHAR(1000) NOT NULL,
    status_profile_username   VARCHAR(300) NOT NULL,
    status_title              VARCHAR(300) NOT NULL
);

CREATE TABLE vote (
    id                         INTEGER NOT NULL,
    header                     INTEGER,
    body                       VARCHAR(3000),
    created                    DATE NOT NULL,
    updated                    DATE NOT NULL,
    opinion_id                 INTEGER NOT NULL,
    opinion_question_id        INTEGER NOT NULL,
    opinion_profile_username   VARCHAR(300) NOT NULL,
    profile_username           VARCHAR(300) NOT NULL,
    question_id                INTEGER NOT NULL,
    description                VARCHAR(3000),
    active                     INTEGER NOT NULL
);

ALTER TABLE vote ADD CONSTRAINT vote_pk PRIMARY KEY ( id );

CREATE TABLE votes_meta (
    vote_id                         INTEGER NOT NULL,
    vote_opinion_id                 INTEGER NOT NULL,
    vote_opinion_question_id        INTEGER NOT NULL,
    vote_opinion_profile_username   VARCHAR(300) NOT NULL,
    vote_profile_username           VARCHAR(300) NOT NULL,
    vote_question_id                INTEGER NOT NULL,
    status_profile_username         VARCHAR(300) NOT NULL,
    status_title                    VARCHAR(300) NOT NULL
);
