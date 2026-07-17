import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/portfolio";
import { ProjectCaseStudy } from "@/components/project-case-study";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

const SITE_URL = "https://saathvik-visuals.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.name} | Saathvik Visuals Case Study`;
  const description = `${project.problem} ${project.outcome}`;
  const url = `${SITE_URL}/work/${project.slug}`;
  const image = `${SITE_URL}${project.image}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [project.name, project.type, project.tag, "Saathvik Visuals", "UI/UX case study"],
    openGraph: {
      type: "article",
      url,
      siteName: "Saathvik Visuals",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: project.name }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} />;
}
