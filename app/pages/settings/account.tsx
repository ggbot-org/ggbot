import { AccountSettingsPage } from "_pages/AccountSettings";
import { requireAuthentication } from "_routing/serverSide";
import { NextPage } from "next";

export const getServerSideProps = requireAuthentication;

const Page: NextPage = () => <AccountSettingsPage />;

export default Page;
