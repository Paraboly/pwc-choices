import { Component, h, Prop } from "@stencil/core";

@Component({
  tag: "pwc-choices-2-selected-item-bubble",
  styleUrl: "pwc-choices-2-selected-item-bubble.scss",
  shadow: true
})
export class PwcChoices2SelectedItemBubbleComponent {
  @Prop() showCloseButton: boolean;

  render() {
    return (
      <div>
        <span class="label">
          <slot />
        </span>
        {this.showCloseButton && <button class="close-button">X</button>}
      </div>
    );
  }
}
