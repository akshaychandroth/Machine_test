
FROM flink:1.20.3-scala_2.12-java17

# Install envsubst for environment variable replacement
RUN apt-get update && \
    apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

# MongoDB CDC source connector
ADD https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-mongodb-cdc/3.7.0-1.20/flink-sql-connector-mongodb-cdc-3.7.0-1.20.jar /opt/flink/lib/

# MongoDB SQL sink connector
ADD https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-mongodb/2.0.0-1.20/flink-sql-connector-mongodb-2.0.0-1.20.jar /opt/flink/lib/
