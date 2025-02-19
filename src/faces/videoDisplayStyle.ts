export const enum VideoDisplayStyle {
    Off = "off",
    Dark = "dark",
    Normal = "normal",
}

interface VideoDisplayStyleInfo {
    readonly style: VideoDisplayStyle;
    readonly name: string;
}

export const videoDisplayStyleInfos: VideoDisplayStyleInfo[] = [
    { style: VideoDisplayStyle.Off, name: "オフ" },
    { style: VideoDisplayStyle.Dark, name: "暗くする" },
    { style: VideoDisplayStyle.Normal, name: "未加工" },
];