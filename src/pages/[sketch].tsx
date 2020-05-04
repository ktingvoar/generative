import fs from "fs";
import path from "path";

import React, { lazy, Suspense, useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
// import { useRouter } from "next/router";
import Link from "next/link";
import { styled } from "linaria/react";

import ErrorBoundary from "../components/ErrorBoundary";
import TextOverlay from "../components/TextOverlay";

const StyledSketchPage = styled.div`
    margin: 0;

    canvas {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    footer a {
        position: fixed;
        font-family: helvetica neue, helvetica, arial, sans-serif;
        font-size: 0.95em;
        padding: 0.05em 0.2em;
        background-color: rgb(85, 85, 85, 0.7);
        --edgeMargin: 40px;
        bottom: var(--edgeMargin);

        :hover {
            background-color: #eee;
        }

        :first-child {
            left: var(--edgeMargin);
        }

        :nth-child(2) {
            right: var(--edgeMargin);
        }

        @media (max-width: 769px) {
            --edgeMargin: 33px;
        }
    }
`;

const SketchPage = ({ sketchId }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => setHasMounted(true), []);

    // const router = useRouter();
    // const { sketch } = router.query;
    // const sketchId = typeof sketch === "string" ? sketch : "";

    const sketchExists = RegExp(/^[0-9]{6}$/).test(sketchId);
    // const sketchExists = sketchArray.includes(sketchId);

    const year = sketchId?.substr(4, 2);
    const month = sketchId?.substr(2, 2);
    const pathToSketch = `sketches/${year}/${month}/${sketchId}`;

    const Sketch = lazy(() => import(`../${pathToSketch}`));

    return (
        <StyledSketchPage>
            <Head>
                <title>{sketchId} — Generative</title>
            </Head>

            {hasMounted &&
                (sketchExists ? (
                    <ErrorBoundary fallback={<TextOverlay text="Error" />}>
                        <Suspense fallback={<TextOverlay text="Loading" />}>
                            <Sketch />
                        </Suspense>
                    </ErrorBoundary>
                ) : (
                    <TextOverlay text="Page not found" /> // FIXME: broken when [sketch] is entrypoint: https://github.com/zeit/next.js/issues/12435
                ))}

            <footer>
                <Link href="/">
                    <a>← Home</a>
                </Link>

                {sketchExists && (
                    <a
                        href={`https://github.com/neefrehman/Generative/blob/master/src/${pathToSketch}.tsx`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {sketchId}
                    </a>
                )}
            </footer>
        </StyledSketchPage>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const sketchArray: string[] = [];

    const sketchDirectory = path.join(process.cwd(), "src/sketches");
    const yearFolders = fs
        .readdirSync(sketchDirectory)
        .filter(folderName => folderName.length === 2);

    yearFolders.forEach(yearFolder => {
        const yearDirectory = path.join(
            process.cwd(),
            `src/sketches/${yearFolder}`
        );
        const monthFolders = fs
            .readdirSync(yearDirectory)
            .filter(folderName => folderName.length === 2);

        monthFolders.forEach(monthFolder => {
            const monthDirectory = path.join(
                process.cwd(),
                `src/sketches/${yearFolder}/${monthFolder}`
            );

            const sketches = fs
                .readdirSync(monthDirectory)
                .filter(sketchFileName => sketchFileName.length === 10);

            sketches.forEach(sketch => {
                const sketchId = sketch.substr(0, 6);
                const isValidSketchId = RegExp(/^[0-9]{6}$/).test(sketchId);

                if (isValidSketchId) sketchArray.push(sketchId);
            });
        });
    });

    return {
        paths: sketchArray.map(sketchId => ({
            params: { id: sketchId }
        })),
        fallback: false
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    return { props: { sketchId: params.id } };
};

export default SketchPage;
