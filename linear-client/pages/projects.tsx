import Head from "next/head";
import ProjectsView from "../components/ProjectsView";
import { AppProvider } from "../lib/context";

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects - Linear</title>
      </Head>
      <ProjectsView />
    </>
  );
}

