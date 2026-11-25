SET 'execution.checkpointing.interval' = '10s';

CREATE TABLE submissions_source (
    _id STRING,
    form_id STRING,
    createdAt TIMESTAMP_LTZ(3),
    PRIMARY KEY (_id) NOT ENFORCED
) WITH (
    'connector' = 'mongodb-cdc',
    'scheme' = 'mongodb+srv',
    'hosts' = 'YOUR_ATLAS_CLUSTER_HOST',
    'username' = 'YOUR_USERNAME',
    'password' = 'YOUR_PASSWORD',
    'database' = 'submission_db',
    'collection' = 'submissions',
    'scan.startup.mode' = 'initial'
);


CREATE TABLE hourly_aggregations (

    form_id STRING,

    hour_bucket STRING,

    total_submissions BIGINT,

    PRIMARY KEY (form_id, hour_bucket) NOT ENFORCED

) WITH (

    'connector' = 'mongodb',

    'uri' = 'YOUR_MONGODB_CONNECTION_URI',

    'database' = 'submission_db',

    'collection' = 'hourly_aggregations'

);


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