FROM golang:1.21
ENV GOPROXY=https://goproxy.cn,direct

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . ./

RUN go build -o ./v-helper ./cmd

EXPOSE 8080

CMD [ "./v-helper" ]
