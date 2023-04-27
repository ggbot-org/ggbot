# NextJS Page handler

Page that requires authentication and use no _server-side prop_.

```ts
import { NextPage } from "next";
import { Content } from "_components";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => {
  return <Content>page content</Content>;
};

export default Page;
```

Page with custom _server-side props_.

```ts
import { GetServerSideProps, NextPage } from "next";
import { Foo } from "_routing/serverSide";

type ServerSideProps = Foo

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  return {
    props: ...
  };
};

const Page: NextPage<ServerSideProps> = () => {
  return (
    <div>
      page content
    </div>
  );
};

export default Page;
```
