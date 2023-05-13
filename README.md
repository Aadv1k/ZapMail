# ZapMail ⚡

This is the repository for [ZapMail](https://zap.up.railway.app) which is the **simplest email solution on the web**

## API

### Errors

Here is an example error response:

```json
{
  "error": {
    "code": "bad_input",
    "message": "email is a required argument"
  },
  "status": 400
}
```

Here are all the possible errors codes: 

- `too_many_requests`
- `bad_input`
- `internal_error`

### `GET /api/v1/email/validate` 

- Implemented at [`./src/routes/EmailValidate`](./src/routes/EmailValidate)

This endpoint validates an email address. It accepts a query parameter email containing the email address to validate.

The validation is done via a combination of domain lookup and a syntax check. Each result is stored within a redis database to prevent overloading of this function

```json
{
  "data": {
    "email": "this@doesnt.exist",
    "valid": false,
    "format_valid": true,
    "domain_valid": false
  },
  "status": 200
}
``` 

### `POST /api/v1/email/send`

- Implemented at [`./src/routes/EmailSend`](./src/routes/EmailSend)

Requires a JSON body

```JSON
{
  "from": "aadv1k@outlook.com",
  "subject": "Hi to aadvik from aadvik 👋",
  "to": [
    {
      "name": "aadv1k",
      "email": "aadv1k@outlook.com"
    }
  ],
  "body": {
    "type": "html",
    "content": "<h1>All good?</h1>"
  }
}
```

#### Success

```
{
  "data": {
    "messageId": "<4ee7eb98-e39f-2ddd-792f-e7a04c299d38@outlook.com>"
  },
  "status": 200
}
```

