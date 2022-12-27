import { fromEvent, Subject } from "rxjs";
import WORDS_LIST from "./wordsList.json";

const letterRows = document.getElementsByClassName("letter-row");
const onKeyDown$ = fromEvent(document, "keydown");
let letterIndex = 0;
let letterRowIndex = 0;
let userAnswer = [];

const getRandomWord = () =>
	WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
let rightWord = getRandomWord();
console.log(`Right word: ${rightWord}`);

const userWinOrLoose$ = new Subject();

const removeLetter = () => {
	letterIndex--;
	let letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
	letterBox.textContent = "";
	letterBox.classList.remove("filled-letter");
};

const insertLetter = {
	next: (event) => {
		const pressedKey = event.key.toUpperCase();
		let letterBox;

		if (pressedKey.length === 1 && pressedKey.match(/[a-z]/i)) {
			letterBox = Array.from(letterRows)[letterRowIndex].children[letterIndex];
			letterBox.textContent = pressedKey;
			letterBox.classList.add("filled-letter");
			userAnswer.push(pressedKey);
			letterIndex++;
		}

		if (pressedKey === "BACKSPACE") {
			removeLetter();
		}
	},
};

const checkWord = {
	next: (event) => {
		if (event.key === "Enter") {
			// Si la respuesta del usuario es igual a la palabra correcta:
			if (userAnswer.join("") === rightWord) {
				// Emite un valor (vacío) hacia el observable `userWinOrLoose$` (ver línea 53)
				userWinOrLoose$.next();
			}
		}
	},
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
userWinOrLoose$.subscribe(() => {
	let letterRowsWinned = letterRows[letterRowIndex];
	for (let i = 0; i < 5; i++) {
		letterRowsWinned.children[i].classList.add("letter-green");
	}
});
