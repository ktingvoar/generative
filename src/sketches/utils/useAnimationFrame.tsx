import { useEffect, useRef, useCallback } from "react";
import type { MutableRefObject } from "react";

import { getMean, Vector } from "Utils/math";

/**
 * A custom hook to use `requestAnimationFrame` in a React component
 *
 * @param options - An optional configuration object for the hook
 * @returns An object containing the current elapsedTime, frameCount and fps of the animation, as well as a functions to stop and start the animation
 */
export const useAnimationFrame = (
    options: UseAnimationFrameOptions = {}
): UseAnimationFrameResult => {
    const {
        onStart,
        onFrame,
        onEnd,
        delay,
        endAfter,
        fps: throttledFps,
        willPlay = true,
        domElementRef
    } = options;

    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<DOMHighResTimeStamp>(performance.now());
    const prevFrameTimeRef = useRef<DOMHighResTimeStamp>(performance.now());

    const isPlaying = useRef(false);
    const elapsedTime = useRef(0);
    const frameCount = useRef(1);
    const fpsArray = useRef<number[]>(new Array(10).fill(throttledFps ?? 60));
    const averageFps = useRef(throttledFps ?? 60);

    const mouseHasEntered = useRef(false);
    const mousePosition = useRef<Vector<2>>([0, 0]);

    const animate = useCallback(
        (timestamp: DOMHighResTimeStamp) => {
            elapsedTime.current = Math.round(timestamp - startTimeRef.current);
            const deltaTime = (timestamp - prevFrameTimeRef.current) / 1000;
            const currentFps = Math.round(1 / deltaTime);

            const runFrame = () => {
                onFrame?.();
                frameCount.current += 1;
                fpsArray.current.shift();
                fpsArray.current = [...fpsArray.current, currentFps];
                averageFps.current = getMean(fpsArray.current);
                prevFrameTimeRef.current = timestamp;
            };

            if (throttledFps) {
                if (deltaTime >= 1 / throttledFps) runFrame();
            } else {
                runFrame();
            }

            requestRef.current = requestAnimationFrame(animate);
        },
        [onFrame, throttledFps]
    );

    const startAnimation = () => {
        if (!isPlaying.current) {
            requestRef.current = requestAnimationFrame(animate);
            isPlaying.current = true;
        }
    };

    const stopAnimation = () => {
        if (isPlaying.current) {
            cancelAnimationFrame(requestRef.current);
            isPlaying.current = false;
        }
    };

    useEffect(() => {
        if (willPlay) {
            setTimeout(() => {
                startAnimation();
                onStart?.();
            }, delay ?? 0);

            if (endAfter) {
                setTimeout(() => {
                    stopAnimation();
                    onEnd?.();
                }, endAfter);
            }
        }

        return () => stopAnimation();
    }, [animate, onStart, onEnd, delay, endAfter, willPlay]);

    useEffect(() => {
        const domElement = domElementRef?.current;

        const updateMousePosition = (x: number, y: number) => {
            const canvasBounds = domElementRef.current.getBoundingClientRect();
            const posX = x - canvasBounds.left;
            const posY = y - canvasBounds.top;
            mousePosition.current = [posX, posY];
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseHasEntered.current = true;
            updateMousePosition(e.clientX, e.clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            updateMousePosition(touch.clientX, touch.clientY);
        };

        if (domElement) {
            domElement.addEventListener("mousemove", handleMouseMove);
            domElement.addEventListener("touchmove", handleTouchMove);
        }

        return () => {
            if (domElement) {
                domElement.removeEventListener("mousemove", handleMouseMove);
                domElement.removeEventListener("touchmove", handleTouchMove);
            }
        };
    }, [domElementRef]);

    return {
        elapsedTime,
        frameCount,
        fps: averageFps,
        stopAnimation,
        startAnimation,
        isPlaying,
        mouseHasEntered,
        mousePosition
    };
    // TODO: check if there's a nicer way than having to get the `current` all the time for each property.
    // State cases memory leaks, passing refs current doesnt update, but passing refs then getting their current on the other
    // side of the return does. Feels way too clunky.
};

/**
 * An optional configuration object for `useAnimationFrame`
 */
interface UseAnimationFrameOptions {
    /** A callback that will be run once when the animation starts */
    onStart?: () => void;
    /** A callback that will be run on every frame of the animation */
    onFrame?: () => void;
    /** A callback that will be run on once when the animation ends */
    onEnd?: () => void;
    /** A delay (in ms) after which the animation will start */
    delay?: number;
    /** A time (in ms) after which the animation will be stopped */
    endAfter?: number;
    /** The desired fps that the animation will be throttled to */
    fps?: number;
    /** Determines if the animation will run or not. Used to invoke the hook without starting an animation. Defaults to true */
    willPlay?: boolean;
    /** A ref to be passed of the dom element that is being animated. USed to get the mouse position over the element */
    domElementRef?: MutableRefObject<HTMLElement>;
}

/**
 * The returned object from `useAnimationFrame`
 */
interface UseAnimationFrameResult {
    /** The current elapsed time of the animation in ms */
    elapsedTime: MutableRefObject<number>;
    /** The current number of elapsed frames */
    frameCount: MutableRefObject<number>;
    /** The current fps of the animation (averaged over the last 10 frames) */
    fps: MutableRefObject<number>;
    /** A function that will stop the animation when called */
    stopAnimation: () => void;
    /** A function that will restart the animation when called */
    startAnimation: () => void;
    /** True if the animation is currenty running, otherwise false */
    isPlaying: MutableRefObject<boolean>;
    /** A boolean that is true if the mouse has interacted with the animation */
    mouseHasEntered: MutableRefObject<boolean>;
    /** The position of the mouse over the DOM element housing the animation */
    mousePosition: MutableRefObject<Vector<2>>;
}
