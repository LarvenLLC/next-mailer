# next-mailer

> Intelligent, minimal, server and client side mailer for NextJS, NodeJS and JS Applications and Servers.

[![NPM](https://img.shields.io/npm/v/next-mailer.svg)](https://www.npmjs.com/package/next-mailer) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save next-mailer
```

Or

```bash
yarn add next-mailer
```

## Usage - Mailing

### Configure env Variables
- Using one of known providers eg. gmail. See full list [here](https://nodemailer.com/smtp/well-known/).

```env
MAILER_USER=account.email@example.com
MAILER_PASSWORD=smtp-password
MAILER_SERVICE=SendPulse
```

- Using custom provider.

```env
MAILER_USER=account.email@example.com
MAILER_PASSWORD=smtp-password
MAILER_HOST=smtp.hostname.com
MAILER_PORT=587
```

** Other smtp mailer options can be passed while initializing NextMailer. See below.

### 1. Add API in `/pages/api/mailer/index.js`
- Default initialization. Eg when using a known provider.

```jsx
// /pages/api/mailer/index.js
import NextMailer from "next-mailer";

export default NextMailer();
```

- Initialization with extra options

```jsx
// /pages/api/mailer/index.js
import {NextMailer} from "next-mailer";

export default NextMailer({
  secureConnection: false,
  tls: {
      ciphers: 'SSLv3'
  }
});
```

- Using custom logger

```jsx
// /pages/api/mailer/index.js
import {NextMailer} from "next-mailer";

import log from "next-logs";

export default NextMailer({
  logger: {
    info: (message, object) => log.info(message, object)
    error: (message, object) => log.info(message, object)
  },
});
```

### 2. Client Side
The client side API uses API routes hence it works in both: client and server side.

```jsx
// /pages/*.js
import mail from "next-mailer/react";

export default Page() {
  useEffect(() => {
    mail({
      receivers: 'bossbele@larven.io, mkoela@larven.io',
      sender: "Larven LLC",
      subject: 'Meeting',
      text: "Let's meet up at 10:00"
    });
    mail({
      receivers: 'bossbele@larven.io, mkoela@larven.io',
      sender: "Larven LLC",
      subject: 'Meeting',
      html: "<b>Let's meet up at 10:00</b>"
    });
  },[]);

  return (
    <div />
  )
};
```

### 3. Server Side
Next mailer ships with a server side API that makes mailing more efficient.

```jsx
// in your helper function eg. /helper/mailer
import {Mailer} from "next-mailer";

const mailer = Mailer();

export default mailer;
```

```jsx
// /pages/api/auth.js || /middleware.js
import {mailer} from "../../helper/mailer"; // import from your helper file

async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'DELETE':
        // delete user
        mailer({
          receivers: 'user@larven.io',
          sender: "Noreply Larven",
          subject: 'Account Deletion',
          text: "Your account was deleted successfully"
        })
        break;
      default:
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
    // send result
    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json(error);
  }
}
```

## NextJS Middleware
While using nextJS middleware in API routes, make sure that your middleware does not block requests at `/api/mailer/` routes. This may lead to errors and malfunctioning while using `next-mailer`.

## License

MIT © [BossBele](https://github.com/BossBele)
