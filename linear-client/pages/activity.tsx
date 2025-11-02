import Head from "next/head";
import ActivityFeed from "../components/ActivityFeed";
import { AppProvider } from "../lib/context";

export default function Activity() {
  return (
    <>
      <Head>
        <title>Activity - Linear</title>
      </Head>
      <div className="activity-page">
        <ActivityFeed />
      </div>
    </>
  );
}

