import { useRef, useEffect } from 'react';

/**
 * Hook for creating an animation based on the position of an HTMLElement in
 * the viewport.
 *
 * This is an alternative to the waypoint triggered animation.
 *
 * Say, an html element has to provide animate.css fadeInUp animation when the
 * 10% of the element is visible above the viewport height, use the hook as
 *
 * const [ref] = useAnimation('fadeInUp',0.1);
 *
 * <div ref={ref} className='toAnimate animated'></div>
 *
 * As soon as the 10% of the above div becomes visible on the viewport, 'fadeInUp'
 * class will be added to the element and the element will animate.
 *
 * [1] Multiple classes seperated by whitespace can be submitted as animationClasses.
 * [2] The parameter animationClasses cannot be empty.
 * [3] onViewPercentage has a default value of 0, causing the animation to trigger as
 * soon as the top of the element overlaps with the viewport height.
 *
 * @param animationClasses
 * @param onViewPercentage
 */
export function useAnimation(animationClasses: string, onViewPercentage: number = 0) {
    // Throw an error if invalid animation class is provided. This hooks
    // serves no purpose without an animation class.
    if (!animationClasses.length) {
        throw new Error('Please provide one animation class.');
    }

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        /**
         * Callback to execute when IntersectionObserver is triggered.
         * The function checks if an event is resulting in presence of the
         * element in the viewport, then the animation classes are added
         * to the target element - ref.current.
         *
         * Classes are added only if it does not exist in the target element.
         *
         * @param events
         */
        const callback: IntersectionObserverCallback = (events) => {
            // Lazy check to avoid the main observer event checks.
            if (ref.current?.className.includes(animationClasses)) {
                return;
            }

            events.forEach((event) => {
                if (event.isIntersecting) {
                    ref.current?.classList.add(...animationClasses.split(' '));
                }
            });
        };
        const observer = new IntersectionObserver(callback, {
            threshold: onViewPercentage,
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        // Disconnect the observer when the component unmounts.
        return () => {
            observer.disconnect();
        };
    }, [ref.current]);

    return [ref];
}
