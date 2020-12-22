import create from "zustand";
import local from "lib/storage/local";

export const useJournal = create((set, get) => ({
    addEntry: (entry) => set({
        entries: local.save(
            "journal",
            Array.isArray(get().entries)
                ? [...get().entries, entry]
                : [entry]
        ),
    }),
    getEntries: () => set({
        entries: local.get("journal") || [],
    }),
}));
