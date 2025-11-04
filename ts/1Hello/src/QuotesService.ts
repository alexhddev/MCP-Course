const happyQuotes = [
    'Joy is not found, it is created.',
    'Small moments build great lives.',
    'Hope grows wherever we plant it.'
]

const sadQuotes = [
    'Some silences are never filled.',
    'Not all journeys lead us home.',
    'Time heals, but memory remains.'
]

const neutralQuotes = [
    'Change arrives whether were ready or not.',
    'Every choice closes a thousand doors.',
    'We are all both teacher and student.'
]

const allQuotes = happyQuotes.concat(sadQuotes, neutralQuotes);

export function getHappyQuote() {
    const index = Math.floor(Math.random() * happyQuotes.length);
    return happyQuotes[index];
}

export function getSadQuote() {
    const index = Math.floor(Math.random() * sadQuotes.length);
    return sadQuotes[index];
}

export function getQuotes(numberOfQuotes: number): string[] {
    if (numberOfQuotes > allQuotes.length) {
        throw new Error(`Requested number of quotes (${numberOfQuotes}) exceeds available quotes(${allQuotes.length})`);
    }

    const shuffledQuotes = allQuotes.sort(() => 0.5 - Math.random());
    return shuffledQuotes.slice(0, numberOfQuotes);
}
