# NextJS Page handler

For a page that requires authentication and use no server side prop, use the following template

```ts
import type { GetServerSideProps, NextPage } from "next";
import { Content } from "_components";
import { requireAuthentication } from "_routing";

type ServerSideProps = {
  ...
}

export const getServerSideProps: GetServerSideProps = async () => {
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

A page with custom *serverSideProps* looks like

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