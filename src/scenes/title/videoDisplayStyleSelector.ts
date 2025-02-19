import { Component } from "../../components/component";
import { faceMoonChallengeLocalStorage } from "../../data/faceMoonChallengeLocalStorage";
import { VideoDisplayStyle, videoDisplayStyleInfos } from "../../faces/faceStateTracker";
import { sceneController } from "../sceneController";

export class VideoDisplayStyleSelector extends Component {
    constructor() {
        super();
        this.element = $(`<select class="video-style-selector">`).append(
            videoDisplayStyleInfos.map(info => $(`<option>`)
                .prop("selected", info.style == faceMoonChallengeLocalStorage.videoDisplayStyle)
                .text(info.name)
                .val(info.style)
            )
        ).on("change", () => {
            const newStyle = this.element.val() + "";
            if (videoDisplayStyleInfos.find(s => s.style == newStyle) != null) {
                faceMoonChallengeLocalStorage.videoDisplayStyle = newStyle as VideoDisplayStyle;
                sceneController.faceStateTracker.videoDisplayStyle = newStyle as VideoDisplayStyle;
            }
        });
    }
}