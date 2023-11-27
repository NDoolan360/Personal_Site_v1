import { describe, expect, test } from "bun:test";
import { file } from "bun";
import {
    projectIntoTemplate,
    scrapeBgg,
    scrapeCults3d,
    scrapeGithub,
    upgradeBggImage,
} from "projects";
import { fetchData } from "utils";

describe("Projects", () => {
    test("Github project into Template", async () => {
        const indexData = await file("index.html").text();
        const indexMockDoc = await fetchData(indexData);
        const githubMockData = await file("tests/data/githubProjects.html").text();
        const githubMockDoc = await fetchData(githubMockData);

        const template = indexMockDoc.getElementById("project-template") as HTMLTemplateElement;
        const githubProjects = scrapeGithub(githubMockDoc);
        const project = githubProjects.at(0);

        expect(project).not.toBeUndefined();
        if (project) {
            expect(template).not.toBeUndefined();
            const fragment = projectIntoTemplate(project, template);

            expect(
                fragment.querySelector<HTMLHeadingElement>('[class*="card-heading"]')?.textContent,
            ).toBe("NDoolan360-Site");
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-description"]')
                    ?.textContent,
            ).toBe("My hand crafted personal website");
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-link"]')?.href).toBe(
                "https://github.com/NDoolan360/NDoolan360-Site",
            );
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-language-name"]')
                    ?.textContent,
            ).toBe("TypeScript");
            expect(
                fragment
                    .querySelector<HTMLSpanElement>('[class*="card-language-colour"]')
                    ?.getAttribute("style"),
            ).toBe("background-color: #3178c6");
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.href).toBe(
                "https://github.com/NDoolan360/NDoolan360-Site",
            );
            expect(
                fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.innerHTML,
            ).toBe("github");
            expect(
                fragment.querySelector<HTMLImageElement>('[class*="card-feature-image"]')?.src,
            ).toBe("/images/default.webp");
        }
    });

    test("Cults3d project into Template", async () => {
        const indexData = await file("index.html").text();
        const indexMockDoc = await fetchData(indexData);
        const cults3dMockData = await file("tests/data/cults3dProjects.html").text();
        const cults3dMockDoc = await fetchData(cults3dMockData);

        const template = indexMockDoc.getElementById("project-template") as HTMLTemplateElement;
        const cults3dProjects = scrapeCults3d(cults3dMockDoc);
        const project = cults3dProjects.at(0);

        expect(project).not.toBeUndefined();
        if (project) {
            expect(template).not.toBeUndefined();
            const fragment = projectIntoTemplate(project, template);

            expect(
                fragment.querySelector<HTMLHeadingElement>('[class*="card-heading"]')?.textContent,
            ).toBe("Reciprocating Rack and Pinion Fidget V2");
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-description"]')
                    ?.textContent,
            ).toBeUndefined();
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-link"]')?.href).toBe(
                "https://cults3d.com/en/3d-model/gadget/reciprocating-rack-and-pinion-fidget-v2",
            );
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-language-name"]')
                    ?.textContent,
            ).toBeUndefined();
            expect(
                fragment
                    .querySelector<HTMLSpanElement>('[class*="card-language-colour"]')
                    ?.getAttribute("style"),
            ).toBeUndefined();
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.href).toBe(
                "https://cults3d.com/en/3d-model/gadget/reciprocating-rack-and-pinion-fidget-v2",
            );
            expect(
                fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.innerHTML,
            ).toBe("cults3d");
            const featureImage = fragment.querySelector<HTMLImageElement>(
                '[class*="card-feature-image"]',
            );
            expect(featureImage).not.toBeUndefined();
            if (featureImage) {
                expect(featureImage.src).toBe("/images/default.webp");
                if (featureImage.onload) {
                    featureImage.onload(new Event("load"));
                    expect(featureImage.src).toBe(
                        "https://images.cults3d.com/{RRaP Image Link}/https://files.cults3d.com/{RRaP High-res Image Link}",
                    );

                    featureImage.onload(new Event("load"));
                    expect(featureImage.src).toBe(
                        "https://files.cults3d.com/{RRaP High-res Image Link}",
                    );
                }
            }
        }
    });

    test("Bgg project into Template", async () => {
        const indexData = await file("index.html").text();
        const indexMockDoc = await fetchData(indexData);
        const bggMockData = await file("tests/data/bggProjects.html").text();
        const bggMockDoc = await fetchData(bggMockData);
        const bggMockXmlData = await file("tests/data/bggImage.xml").text();
        const bggMockXml = await fetchData(bggMockXmlData, "text/xml");

        const template = indexMockDoc.getElementById("project-template") as HTMLTemplateElement;
        const bggProjects = scrapeBgg(bggMockDoc);
        const project = bggProjects.at(0);

        expect(project).not.toBeUndefined();
        if (project) {
            upgradeBggImage(project, bggMockXml);

            expect(template).not.toBeUndefined();
            const fragment = projectIntoTemplate(project, template);

            expect(
                fragment.querySelector<HTMLHeadingElement>('[class*="card-heading"]')?.textContent,
            ).toBe("Cake Toppers");
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-description"]')
                    ?.textContent,
            ).toBe("Bakers assemble the most outrageous cakes to top each other.");
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-link"]')?.href).toBe(
                "https://boardgamegeek.com/boardgame/330653/cake-toppers",
            );
            expect(
                fragment.querySelector<HTMLParagraphElement>('[class*="card-language-name"]')
                    ?.textContent,
            ).toBeUndefined();
            expect(
                fragment
                    .querySelector<HTMLSpanElement>('[class*="card-language-colour"]')
                    ?.getAttribute("style"),
            ).toBeUndefined();
            expect(fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.href).toBe(
                "https://boardgamegeek.com/boardgame/330653/cake-toppers",
            );
            expect(
                fragment.querySelector<HTMLAnchorElement>('[class*="card-logo"]')?.innerHTML,
            ).toBe("boardgamegeek");
            const featureImage = fragment.querySelector<HTMLImageElement>(
                '[class*="card-feature-image"]',
            );
            expect(featureImage).not.toBeUndefined();
            if (featureImage) {
                expect(featureImage.src).toBe("/images/default.webp");
            }

            if (featureImage?.onload) {
                featureImage.onload(new Event("load"));
                expect(featureImage.src).toBe("{Cake Toppers Image Link}");

                featureImage.onload(new Event("load"));
                expect(featureImage.src).toBe("{Cake Toppers High-res Image Link}");
            }
        }
    });
});
