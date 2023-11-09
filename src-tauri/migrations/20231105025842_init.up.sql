CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE author (
   author_id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
   name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE note (
        note_id UUID PRIMARY KEY NOT NULL DEFAULT (uuid_generate_v4()),
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        category VARCHAR(100),
        published BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        author_id UUID REFERENCES author(author_id) NOT NULL
);
