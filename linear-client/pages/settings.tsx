import Head from "next/head";
import Settings from "../components/Settings";

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings - Linear</title>
      </Head>
      <div className="settings-page">
        <Settings />
      </div>
    </>
  );
}

