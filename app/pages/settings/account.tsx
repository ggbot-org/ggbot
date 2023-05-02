import { NextPage } from "next";
import { AccountSettingsPage } from "_pages/AccountSettings";
import { requireAuthentication } from "_routing/serverSide";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <AccountSettingsPage />;

export default Page;
