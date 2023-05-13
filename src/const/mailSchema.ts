const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "to": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string", "format": "email"}
        },
        "required": ["name", "email"]
      },
      "minItems": 1
    },
		"from": {"type": "string"},
    "subject": {"type": "string"},
    "body": {
      "type": "object",
      "properties": {
        "type": {"type": "string", "enum": ["text", "html"]},
        "content": {"type": "string"}
      },
      "required": ["type", "content"]
    }
  },
  "required": ["to", "from", "subject", "body"]
}


export default schema;
