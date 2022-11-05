import playAudio from "./playAudio";

export enum PlayType {
  START,
  FINISH,
  WARNING,
}

export default function play(type: PlayType) {
  playAudio(type);
}
