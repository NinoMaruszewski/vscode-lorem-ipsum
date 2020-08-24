// Imports
import { LoremIpsum } from "lorem-ipsum";
import * as vscode from "vscode";

/**
 * Generate Lorem Ipsum placeholder text of a certain length.
 *
 * @param length Length of the Lipsum text.
 * @param lengthType Words, sentences, or paragraphs.
 */
function generateLoremIpsum(length: number, lengthType: string): string {
    const lorem = new LoremIpsum({
        sentencesPerParagraph: {
            min: 3,
            max: 9,
        },
        wordsPerSentence: {
            min: 4,
            max: 20,
        },
    });

    if (lengthType === "words") {
        return lorem.generateWords(length);
    } else if (lengthType === "sentences") {
        return lorem.generateSentences(length);
    } else {
        return lorem.generateParagraphs(length);
    }
}

/**
 * Check if the text from the input box is a valid number and between 0 and 1000.
 *
 * @param lenText Text from the input box.
 */
function checkLengthInput(lenText: string) {
    const lenTextNum = Number(lenText);
    if (isNaN(lenTextNum)) {
        return "Please enter a valid number.";
    } else if (lenTextNum > 1000 || lenTextNum < 0) {
        return "Please enter a number between 1 and 1000.";
    } else {
        return;
    }
}

/**
 * Function for interfacing with the user to create the Lipsum text.
 */
export default async function vscodeLipsum(): Promise<void> {
    // Get the length of the text to be generated
    let length = await vscode.window.showInputBox({
        prompt:
            "How much Lorem Ipsum text do you want to generate, in a number.\nThis many words, sentences, or paragraphs will be generated.",
        placeHolder: "10",
        validateInput: checkLengthInput,
    });
    if (!length) {
        return;
    }

}
