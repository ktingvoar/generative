import React, { useRef, useEffect } from "react";
import * as THREE from "three";

import { useAnimationFrame } from "hooks/useAnimationFrame";

import type {
    RendererProps,
    RendererSettings,
    DrawProps,
    SetupFn,
    DrawFn,
} from "./types";

/**
 * A wrapper component for running three.js sketches. Handles rendering and cleanup.
 */
export const ThreeRenderer = ({
    sketch: setupSketch,
    settings = {},
    className,
    style,
    children,
}: ThreeRendererProps) => {
    const wrapperElement = useRef<HTMLDivElement>(null);
    const drawProps = useRef<ThreeDrawProps>({} as ThreeDrawProps);
    const drawFunction = useRef<ThreeDrawFn>();

    const {
        dimensions = [window.innerWidth, window.innerHeight],
        isAnimated = true,
        animationSettings = {},
    } = settings;

    const [width, height] = dimensions;
    const { fps: throttledFps, delay, endAfter } = animationSettings;

    const { startAnimation, stopAnimation } = useAnimationFrame(
        animationProps =>
            drawFunction.current?.({
                ...drawProps.current,
                frame: animationProps.frameCount,
                time: animationProps.elapsedTime,
                fps: animationProps.fps,
                startAnimation,
                stopAnimation,
                isPlaying: animationProps.isPlaying,
                mouseHasEntered: animationProps.mouseHasEntered,
                mousePosition: animationProps.mousePosition,
            }),
        {
            willPlay: isAnimated,
            fps: throttledFps,
            delay,
            endAfter,
            domElementRef: wrapperElement,
        }
    );

    useEffect(() => {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        wrapperElement.current.appendChild(renderer.domElement);

        const initialSketchProps: ThreeDrawProps = {
            scene,
            renderer,
            width,
            height,
            aspect: width / height,
            mouseHasEntered: false,
            mousePosition: [0, 0],
        };

        const drawSketch = setupSketch(initialSketchProps);

        drawProps.current = initialSketchProps;
        drawFunction.current = drawSketch;

        drawSketch(initialSketchProps);

        return () => {
            scene.children.forEach(child => scene.remove(child));
            renderer.dispose();
        };
    }, [setupSketch, settings, width, height]);

    return (
        <>
            <div ref={wrapperElement} className={className} style={style} />
            {children}
        </>
    );
};

export type ThreeRendererProps = RendererProps<ThreeSetupFn>;

/**
 * Settings for the Three sketch
 */
export type { RendererSettings as ThreeRendererSettings };

/**
 * Props to be recieved by the Three sketch.
 */
export type ThreeDrawProps = {
    /** Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras. */
    scene: THREE.Scene;
    /** The WebGL renderer for the scene */
    renderer: THREE.WebGLRenderer;
} & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `ThreeDrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type ThreeSetupFn = SetupFn<ThreeDrawProps, ThreeDrawFn>;

/**
 * The draw function returned by `ThreeSetupFn`, with access to `ThreeDrawProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type ThreeDrawFn = DrawFn<ThreeDrawProps>;
