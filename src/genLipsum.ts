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
async function makeLipsum(): Promise<string> {
    // Get the length of the text to be generated:
    let length = await vscode.window.showInputBox({
        prompt:
            "How much Lorem Ipsum text do you want to generate, in a number.\nThis many words, sentences, or paragraphs will be generated.",
        placeHolder: "10",
        validateInput: checkLengthInput,
    });

    // If the user canceled out, quit.
    if (!length) {
        return "";
    }

    // Convert length to number
    const lengthNum = Number(length);

    // Ask for words, sentences, or paragraphs:
    let lenType = await vscode.window.showQuickPick(
        ["words", "sentences", "paragraphs"],
        { canPickMany: false }
    );

    // If the user canceled out, quit.
    if (!lenType) {
        return "";
    }

    // Now, generate the lipsum text:
    const lipsum = generateLoremIpsum(lengthNum, lenType);

    // Add "Lorem ipsum dolor sit amet, " to the front if the string is over 5 words.
    if (lenType !== "words" || (lenType === 'words' && lengthNum > 5)) {
        const lipsumLower = lipsum.charAt(0).toLowerCase() + lipsum.slice(1);
        var lipsumFixed = "Lorem ipsum dolor sit amet, " + lipsumLower;
    } else {
        var lipsumFixed = lipsum;
    }

    return lipsumFixed;
}

export async function vscodeLipsum() {
    // Get lipsum text:
    const lipsum = await makeLipsum();

    // Check if editor is open:
    const editor = vscode.window.activeTextEditor;

    // If there is no open editor, open one:
    if (!editor) {
        const document = await vscode.workspace.openTextDocument({
            content: lipsum,
        });
        vscode.window.showTextDocument(document);
    }
    // Otherwise, paste the text in the current editor:
    else {
        editor.edit((editBuilder) => {
            // Get selected text
            const selections = editor.selections;

            // For each selection:
            selections.forEach((selection) => {
                // Delete selected text:
                editBuilder.delete(selection);

                // Insert new lipsum text:
                editBuilder.insert(selection.start, lipsum);
            });
        });
    }
}

export async function clipboardLipsum(): Promise<void> {
    // Get lipsum text:
    const lipsum = await makeLipsum();

    // Write text to clipboard:
    const clipboard = vscode.env.clipboard;
    return clipboard.writeText(lipsum);
}
