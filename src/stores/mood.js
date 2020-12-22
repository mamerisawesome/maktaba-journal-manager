import create from "zustand";
import { green, yellow, blue, red } from "@ant-design/colors";

export const constants = {
  moods: [
      ["Excited", yellow[6]],
      ["Happy", green[6]],
      ["Normal", "#262626"],
      ["Sad", blue[6]],
      ["Angry", red[6]],
  ],
};

export const DEFAULT_MOOD_STATE = constants.moods[2];
export const [DEFAULT_MOOD] = DEFAULT_MOOD_STATE;

export const useMood = create((set) => ({
    mood: DEFAULT_MOOD,
    setMood: (mood) => set({
      mood: mood || DEFAULT_MOOD,
    }),
}));
