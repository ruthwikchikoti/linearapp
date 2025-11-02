import Head from "next/head";
import CyclesView from "../components/CyclesView";
import { AppProvider } from "../lib/context";

export default function Cycles() {
  return (
    <>
      <Head>
        <title>Cycles - Linear</title>
      </Head>
      <CyclesView />
    </>
  );
}

