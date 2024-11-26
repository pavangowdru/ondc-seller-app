# Use the official PostgreSQL image from the Docker Hub
FROM postgres:latest

# Set environment variables for the database
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydb

# Optional: Add custom init SQL scripts to set up the database
# These scripts will automatically be executed during the first run of the container
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432