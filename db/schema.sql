CREATE TABLE IF NOT exists users (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    sname VARCHAR(100) NOT NULL,
    profile_picture TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT exists recommendations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT exists collections (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_collection_name UNIQUE (user_id, name)
);
CREATE TABLE IF NOT exists collection_recommendations (
    collection_id INT REFERENCES collections(id) ON DELETE CASCADE,
    recommendation_id INT REFERENCES recommendations(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, recommendation_id)
);


