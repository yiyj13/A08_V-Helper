FROM golang:1.21

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN go build -o ./v-helper ./cmd

EXPOSE 8080

CMD [ "./v-helper" ]
