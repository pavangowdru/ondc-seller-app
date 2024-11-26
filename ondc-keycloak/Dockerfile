FROM registry.access.redhat.com/ubi9 AS ubi-micro-build
RUN mkdir -p /mnt/rootfs
RUN dnf install --installroot /mnt/rootfs curl --releasever 9 --setopt install_weak_deps=false --nodocs -y && \
    dnf --installroot /mnt/rootfs clean all && \
    rpm --root /mnt/rootfs -e --nodeps setup


FROM quay.io/keycloak/keycloak:latest as builder
COPY --from=ubi-micro-build /mnt/rootfs /

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Configure a database vendor
ENV KC_DB=postgres

WORKDIR /opt/keycloak

# Generate keypair (for demonstration purposes, adjust for production)
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 \
    -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" \
    -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:latest
COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Copy curl binary and required libraries from the build stage
COPY --from=builder /usr/bin/curl /usr/bin/
COPY --from=builder /usr/lib64/libcurl.so.* /usr/lib64/
COPY --from=builder /usr/lib64/libssl.so.* /usr/lib64/
COPY --from=builder /usr/lib64/libcrypto.so.* /usr/lib64/

# Add the JSON file for realm import
COPY realm-config.json /opt/keycloak/data/import/realm-config.json

# Environment variables for connecting to PostgreSQL
ENV KC_DB=postgres
ENV KC_DB_URL="jdbc:postgresql://ondc-postgres:5432/mydb"
ENV KC_DB_USERNAME=myuser
ENV KC_DB_PASSWORD=mypassword
ENV PROXY_ADDRESS_FORWARDING=true
ENV KC_PROXY=edge
ENV KC_HTTP_ENABLED=true
#ENV KC_HOSTNAME=ondc-keycloak.ondc.local
ENV KC_HOSTNAME=https://ondcseller.in.net
ENV KC_HOSTNAME_STRICT_HTTPS=true
#ENV KC_HTTPS_CERTIFICATE_FILE=keycloak.crt
#ENV KC_HTTPS_CERTIFICATE_KEY_FILE=keycloak.key

# Enable automatic import of realm data
ENV KC_IMPORT=dir:/opt/keycloak/data/import

# Run Keycloak
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm", "--proxy-headers=forwarded", "--health-enabled=true", "--metrics-enabled=true"]
