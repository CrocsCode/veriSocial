FROM alpine:latest

COPY ./target/x86_64-unknown-linux-musl/debug/verisocial_be .
COPY ./.env .

ENTRYPOINT [ "./verisocial_be" ]