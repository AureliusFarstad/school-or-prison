import { writable } from 'svelte/store';

function createGuess() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        school: () => set('SCHOOL'),
        prison: () => set('PRISON'),
        reset: () => set('')
    }
}
// export const guess = createGuess();

export const guess = writable(null);
export const result = writable(null);
