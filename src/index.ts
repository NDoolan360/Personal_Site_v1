import { inject } from "@vercel/analytics";
import { replaceWithCurrentYear } from "./copyright";
import {
    fetchData,
    projectIntoTemplate,
    scrapeBgg,
    scrapeCults3d,
    scrapeGithub,
    upgradeBggImage,
} from "./projects";
import "./styles.css";

// Insert Analytics
inject();

// Update copyright year
const copyright = document.getElementById("copyright");
if (copyright) {
    copyright.innerHTML = replaceWithCurrentYear(copyright.innerHTML, "{current year}");
}

const loadProjects = async () => {
    // Create project-gallery loader
    const loader = document.createElement("span");
    loader.classList.add("loader");
    document.getElementById("projects")?.append(loader);

    // Load items into gallery
    const gallery = document.getElementById("project-gallery");
    const template = document.getElementById("project-template") as HTMLTemplateElement | undefined;

    if (gallery && template) {
        const githubPage = await fetchData("/proxy/github");
        const githubProjects = scrapeGithub(githubPage).map((p) =>
            projectIntoTemplate(p, template),
        );
        gallery.append(...githubProjects);

        const bggPage = await fetchData("/proxy/boardgamegeek");
        const bggRawProjects = scrapeBgg(bggPage);

        // Get higher resolution image from bgg xmlapi
        for (const project of bggRawProjects) {
            const id = project.url
                ?.toString()
                ?.split("/")
                .find((v) => v.match(/\d+/g));
            const gameXml = await fetchData(`/xmlapi/boardgamegeek/${id}`, "text/xml");
            upgradeBggImage(project, gameXml);
        }

        const bggProjects = bggRawProjects.map((p) => projectIntoTemplate(p, template));

        gallery.append(...bggProjects);

        const cults3dPage = await fetchData("/proxy/cults3d");
        const cults3dProjects = scrapeCults3d(cults3dPage).map((p) =>
            projectIntoTemplate(p, template),
        );
        gallery.append(...cults3dProjects);
    }

    // remove project-gallery loader
    loader.remove();
};

loadProjects();