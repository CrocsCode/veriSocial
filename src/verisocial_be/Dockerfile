FROM alpine:latest

COPY ./target/x86_64-unknown-linux-musl/release/verisocial_be .
COPY ./.env .

ENTRYPOINT [ "./verisocial_be" ]