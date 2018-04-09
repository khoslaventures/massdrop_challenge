# REST API Job Queue

## What I assumed, and would have done differently

Jobs are done FIFO. I don't explicitly use a queue, but I basically take a job and start it as soon as it is created.

I assumed that there was no need for authentication or rate limiting for this - that would take far longer to implement. I would have written tests (Probably with Mocha/Chai) and implemented those two had I had the time.

## How to Run

Make sure you have Yarn, MongoDB and httpie or Postman installed.

Install dependencies with:
`yarn install`

Run the server:
`yarn server`

Source code is in TypeScript and transpiles to ES6.

## Instructions

Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

## Example

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

## Endpoints

### GET /api/v1/ - Gets all jobs
```
❯ http GET localhost:3000/api/v1/
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:08:42 GMT
ETag: W/"8de99-Uo29B3rvUxMJ1mEBzxLzjve48UY"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Transfer-Encoding: chunked
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": [
        {
            "__v": 0,
            "_id": "5acb578109347688bd5fff35",
            "content": "<truncated>",
            "status": "Job is complete",
            "url": "http://www.google.com"
        },
        {
            "__v": 0,
            "_id": "5acb57c109347688bd5fff36",
            "content": "<truncated>",
            "status": "Job is complete",
            "url": "http://www.yahoo.com"
        }
    ],
    "status": 200
}
```
### POST /api/v1/url - Create a job
```
❯ http POST localhost:3000/api/v1/url <<< '{"url": "http://www.google.com"}'
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 130
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:07:29 GMT
ETag: W/"82-YNaYWxm8r5ApLjQaT9FPB/walv0"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": {
        "__v": 0,
        "_id": "5acb578109347688bd5fff35",
        "content": "",
        "status": "In Progress",
        "url": "http://www.google.com"
    },
    "status": 200
}
```

### DELETE /api/v1/ - Delete all jobs
```
❯ http DELETE localhost:3000/api/v1/
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 36
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:06:12 GMT
ETag: W/"24-Ajl0vRbX4wF7rIQVvczoSgagGbE"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": {
        "n": 1,
        "ok": 1
    },
    "status": 200
}
```

### GET /api/v1/:id - Get a job by ID
```
❯ http GET localhost:3000/api/v1/5acb578109347688bd5fff35
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:12:45 GMT
ETag: W/"b8b7-ijiAq0/FDVdk9yWelCU/I7DAuIs"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Transfer-Encoding: chunked
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": {
        "__v": 0,
        "_id": "5acb578109347688bd5fff35",
        "content": "<truncated>",
        "url": "http://www.google.com"
    },
    "status": 200
}

```
### PUT /api/v1/:id - Update a job by ID

```
❯ http PUT localhost:3000/api/v1/5acb578109347688bd5fff35 <<< '{"url":"http://gmail.com"}'
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 125
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:14:33 GMT
ETag: W/"7d-//F8MUlvaW3047OljpaJ00ykZUY"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": {
        "__v": 0,
        "_id": "5acb578109347688bd5fff35",
        "content": "",
        "status": "In Progress",
        "url": "http://gmail.com"
    },
    "status": 200
}
```

### DELETE /api/v1/:id - Delete a job by ID
```
❯ http DELETE localhost:3000/api/v1/5acb578109347688bd5fff35
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:15:41 GMT
ETag: W/"13e16-KlIAhZgLvuf9FwkS64KRCKqSvX8"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Transfer-Encoding: chunked
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": {
        "__v": 0,
        "_id": "5acb578109347688bd5fff35",
        "content": "<truncated>",
        "status": "Job is complete",
        "url": "http://gmail.com"
    },
    "status": 200
}
```

```
❯ http GET localhost:3000/api/v1/5acb5202d326fa515df3d064
```
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 26
Content-Type: application/json; charset=utf-8
Date: Mon, 09 Apr 2018 12:16:20 GMT
ETag: W/"1a-GQNbY0Y54h9X9g6znIBxjch9Hpw"
Strict-Transport-Security: max-age=15552000; includeSubDomains
Vary: Accept-Encoding
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block

{
    "data": null,
    "status": 200
}
```