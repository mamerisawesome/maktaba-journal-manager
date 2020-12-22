export const deepClone = (obj) => JSON.parse(
    JSON.stringify(obj)
);

export const presentDate = (dateInput) => {
    let formatted = dateInput.split("/").join("-");
    formatted = formatted.split(" ");
    formatted[1] = formatted[1].split(":")
        .map(timeParam => {
            if (timeParam.length === 1) {
                return "0" + timeParam;
            }
            return timeParam;
        })
        .join(":");
    formatted.join("T");

    const d = new Date(formatted + "Z");
    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
    const mo = new Intl.DateTimeFormat("en", { month: "long" }).format(d)
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
    // TODO fixed wrong time display of time
    // const time = new Intl.DateTimeFormat("en", {
    //     hour: "numeric",
    //     minute: "numeric",
    // }).format(d)

    return `${mo} ${da}, ${ye}`;
};

export const formatDate = () => {
    const d = new Date();

    const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
    const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
    const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
    const time = new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    }).format(d);

    return `${ye}-${mo}-${da} ${time}`
        .replace(" AM", "")
        .replace(" PM", "");
};
