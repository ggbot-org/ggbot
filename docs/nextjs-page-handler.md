# NextJS Page handler

Page that requires authentication and use no *server-side prop*.

```ts
import type { NextPage } from "next";
import { Content } from "_components";
import { requireAuthentication } from "_routing";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return (
    <Content>
      page content
    </Content>
  );
};

export default Page;
```

Page with custom *server-side props*.

```ts
import type { GetServerSideProps, NextPage } from "next";
import { Content } from "_components";
import { Foo } from "_routing";

type ServerSideProps = Foo

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  return {
    props: ...
  };
};

const Page: NextPage<ServerSideProps> = () => {
  return (
    <Content>
      page content
    </Content>
  );
};

export default Page;
```
