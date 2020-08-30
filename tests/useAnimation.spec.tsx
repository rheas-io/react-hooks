import { useAnimation } from '../lib/hooks/useAnimation';

describe('useAnimation hook tests', () => {
    // Check if empty animation class throws an error. We need
    // atleast one animation class for this hook to work.
    it('throw error when no class defined', () => {
        expect(() => useAnimation('')).toThrow();
    });
});
