DROP IF EXISTS TABLE posts

CREATE TABLE posts (
  id VARCHAR(10) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  content TEXT
)