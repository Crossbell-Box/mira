import HistoryList from "@/components/HistoryList";
import { getRootLayout } from "@/components/Layout/RootLayout";
import { Stack } from "@mantine/core";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <Stack className="container mx-auto">
      <HistoryList />
    </Stack>
  );
};

Page.getLayout = getRootLayout;

export default Page;
