# Authentication

**Source:** https://kling.ai/document-api/api/get-started/authentication

## Domain

```
https://api-singapore.klingai.com
```

> **Notice:** The API endpoint has been changed from `https://api.klingai.com` to `https://api-singapore.klingai.com`. This API is suitable for users whose servers are located outside of China.

## Authentication Methods

### API Key (for all models)

API Key authentication must be used to call Kling AI API. The sensitivity of this key is high, and leakage can lead to the theft of call limits. Therefore, it is recommended to configure the API Key to be used in the environment variable.

**Step 1:** Open the Kling AI console and log in.  
**Step 2:** Click the "+ New API Key" button.  
**Step 3:** In the popup, name your API Key and confirm. The API Key will then be displayed on the page.  
**Step 4:** Copy the API Key. It will only be shown once — please store it securely.  
**Step 5:** Add the API Key to the Request Header as an Authorization field.

Format: `Authorization = "Bearer XXX"`, where XXX is the API Key obtained in Step 1 (Note: include a space between "Bearer" and the key.)

### Access Key / Secret Key (3.0 and earlier models)

**Step 1:** Obtain AccessKey + SecretKey

**Step 2:** For each API request, generate an API Token using JWT encryption. Put `Authorization = Bearer <API Token>` in the Request Header.

- Encryption Method: Follow JWT (Json Web Token, RFC 7519) standard
- A JWT consists of three parts: Header, Payload, and Signature.

**Python Example:**

```python
import time
import jwt

ak = "" # fill access key
sk = "" # fill secret key

def encode_jwt_token(ak, sk):
    headers = {
        "alg": "HS256",
        "typ": "JWT"
    }
    payload = {
        "iss": ak,
        "exp": int(time.time()) + 1800, # valid for 30 minutes
        "nbf": int(time.time()) - 5     # starts taking effect 5 seconds before current time
    }
    token = jwt.encode(payload, sk, headers=headers)
    return token

authorization = encode_jwt_token(ak, sk)
print(authorization) # Printing the generated API_TOKEN
```

**Step 3:** Use the API Token generated in Step 2 to construct the Authorization header. Format: `Authorization: Bearer XXX`, where XXX is the generated API Token.

> Note: There should be a space between Bearer and XXX.
