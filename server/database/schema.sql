CREATE TYPE user_role AS ENUM('member', 'admin');
CREATE TYPE register_mode AS ENUM('email', 'oauth');
CREATE TYPE register_step
  AS ENUM('email_confirm', 'setup_account', 'follow_painters', 'registered');

CREATE TABLE users (
  id                bigserial                 PRIMARY KEY,
  username          text                      UNIQUE DEFAULT NULL,
  email             text                      UNIQUE NOT NULL,
  pass_digest       text                      NULL,
  location          text                      DEFAULT '',
  image             text                      DEFAULT '',
  bio               text                      DEFAULT '',
  role              user_role                 NOT NULL DEFAULT 'member',
  created_at        timestamp                 NOT NULL DEFAULT NOW(),
  register_mode     register_mode             NOT NULL,
  register_step     register_step             NOT NULL,
  validation_token  text                      NULL,
  available         boolean                   NOT NULL DEFAULT false,
  show_email        boolean                   NOT NULL DEFAULT false,
  deleted           boolean                   NOT NULL DEFAULT false
);

CREATE TABLE users_oauth_providers (
  id            bigserial             PRIMARY KEY,
  user_id       bigint                NOT NULL REFERENCES users(id),
  twitter_id    numeric               NULL,
  facebook_id   numeric               NULL,
  google_id     numeric               NULL
);

CREATE TABLE user_social_networks (
  id            bigserial             PRIMARY KEY,
  user_id       bigint                UNIQUE NOT NULL REFERENCES users(id),
  website       text                  DEFAULT '',
  facebook      text                  DEFAULT '',
  twitter       text                  DEFAULT ''
);

CREATE TABLE user_password_reset (
  id            bigserial             PRIMARY KEY,
  user_id       bigint                NOT NULL REFERENCES users(id),
  used          boolean               NOT NULL DEFAULT false,
  token         text                  NOT NULL
);

CREATE TABLE buckets (
  id            bigserial             PRIMARY KEY,
  user_id       bigint                NOT NULL REFERENCES users(id),
  -- shots         text[],
  name          text                  NOT NULL
);

CREATE TABLE games (
  id            bigserial             PRIMARY KEY,
  name          text                  NOT NULL
);

CREATE TABLE armies (
  id            bigserial             PRIMARY KEY,
  game_id       bigint                NOT NULL REFERENCES games(id),
  name          text                  NOT NULL
);

CREATE TABLE shots (
  id            bigserial             PRIMARY KEY,
  user_id       bigint                NOT NULL REFERENCES users(id),
  created       timestamp             NOT NULL DEFAULT NOW(),
  title         text                  NOT NULL,
  description   text                  NULL,
  army_id       bigint                NOT NULL REFERENCES armies(id),
  bucket_id     bigint                NOT NULL REFERENCES buckets(id),
  url           text                  UNIQUE NOT NULL,
  image         text                  NOT NULL,
  attachments   text[]                NULL,
  likes_count   integer               NOT NULL DEFAULT 0,
  views_count   integer               NOT NULL DEFAULT 0
);

CREATE TABLE user_shots_likes (
  shot_id       bigint               NOT NULL REFERENCES shots(id),
  shot_url      text                 NOT NULL REFERENCES shots(url),
  user_id       bigint               NOT NULL REFERENCES users(id),
  liked         boolean              NOT NULL DEFAULT true,
  PRIMARY KEY (shot_id, user_id)
);
CREATE UNIQUE INDEX url_user_likes_idx ON user_shots_likes (shot_url, user_id);

CREATE MATERIALIZED VIEW search_index AS
SELECT
  s.id,
  s.user_id,
  s.created,
  s.title,
  s.description,
  a.game_id,
  s.army_id,
  s.bucket_id,
  s.url,
  s.image,
  s.attachments,
  s.likes_count,
  s.views_count,
  u.username,
  u.image AS user_image,
    setweight(to_tsvector(s.title), 'A') ||
    setweight(to_tsvector(coalesce(s.description, '')), 'C') ||
    setweight(to_tsvector(u.username), 'B')
  as document
FROM shots as s
LEFT JOIN users as u ON (u.id = s.user_id)
LEFT JOIN armies as a ON (a.id = s.army_id);

-- Index our materialized view on the ts_vector
CREATE INDEX idx_fts_search ON search_index USING gin(document);
