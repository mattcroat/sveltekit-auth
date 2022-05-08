- Generate Prisma schema and client
- Use bcryptjs to hash password
- Write out the authentication flow
- Use bcrypt.compare to compare the passwords
- Check if user exists
- Create bad request function
- httpOnly

https://github.com/remix-run/remix/blob/main/examples/jokes/app/utils/session.server.ts

const passwordHash = await bcrypt.hash(password, 10)
const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)

```
model User {
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  username String @unique
  passwordHash String
  // content
}
```

cookie

```
{
  secure: process.env.NODE_ENV === 'production',
  secrets: [sessionSecret],
  name: 'cookie',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  httpOnly: true
}
```

```
  const user = await db.user.findUnique({
    where: { username },
  });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) return null;
  return { id: user.id, username };
}
```
