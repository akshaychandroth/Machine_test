
-- Enable checkpointing
SET 'execution.checkpointing.interval' = '10s';

-- Use UTC timezone
SET 'table.local-time-zone' = 'UTC';


-- 1. MongoDB CDC source
CREATE TABLE submissions_source (
    _id STRING,
    form_id STRING,
    createdAt TIMESTAMP_LTZ(3),
    PRIMARY KEY (_id) NOT ENFORCED
) WITH (
    'connector' = 'mongodb-cdc',
    'scheme' = 'mongodb+srv',
    'hosts' = '${HOST_NAME}',
    'username' = '${USER_NAME}',
    'password' = '${PASSWORD}',
    'database' = '${MONGO_DATABASE}',
    'collection' = '${MONGO_COLLECTION}',
    'scan.startup.mode' = 'initial'
);


-- 2. MongoDB aggregation sink
CREATE TABLE hourly_aggregations (
    form_id STRING,
    hour_bucket STRING,
    total_submissions BIGINT,
    PRIMARY KEY (form_id, hour_bucket) NOT ENFORCED
) WITH (
    'connector' = 'mongodb',
    'uri' = '${MONGO_URI}',
    'database' = '${MONGO_DATABASE}',
    'collection' = 'hourly_aggregations'
);


-- 3. Calculate hourly submission counts
INSERT INTO hourly_aggregations
SELECT
    form_id,
    DATE_FORMAT(
        createdAt,
        'yyyy-MM-dd HH:00:00'
    ) AS hour_bucket,
    COUNT(*) AS total_submissions
FROM submissions_source
GROUP BY
    form_id,
    DATE_FORMAT(
        createdAt,
        'yyyy-MM-dd HH:00:00'
    );
