FROM alpine:latest

COPY ./target/release/verisocial_be .
COPY ./.env .

ENTRYPOINT [ "./verisocial_be" ]