/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  PwcChoices2,
} from './utils/PwcChoices2';

export namespace Components {
  interface PwcChoices2 {
    /**
    * If true, the placeholder will be hidden if there are selected options.
    */
    'autoHidePlaceholder': boolean;
    'dropdownIsOpen': boolean;
    'getSelectedOptions': (mode?: "option" | "value" | "label") => Promise<PwcChoices2.IOption[] | string[]>;
    /**
    * If not undefined, this will be displayed in dropdown instead of the default text when there are no options left to choose.
    */
    'noOptionsString': string;
    'options': PwcChoices2.IOption[] | string;
    'placeholder': string;
    /**
    * If true, selected option bubbles will have close buttons.
    */
    'showCloseButtons': boolean;
    'type': "single" | "multi";
    /**
    * If true, the option will be removed from available options after selection.
    */
    'uniqueSelections': boolean;
  }
  interface PwcChoices2Dropdown {
    'noOptionsString': string;
    'options': PwcChoices2.IOption[];
  }
  interface PwcChoices2InputBar {
    'autoHidePlaceholder': boolean;
    'options': PwcChoices2.IOption[];
    'placeholder': string;
    'showCloseButtons': boolean;
  }
  interface PwcChoices2OptionBubble {
    'indexInSelectedList': number;
    'option': PwcChoices2.IOption;
    'showCloseButton': boolean;
  }
}

declare global {


  interface HTMLPwcChoices2Element extends Components.PwcChoices2, HTMLStencilElement {}
  var HTMLPwcChoices2Element: {
    prototype: HTMLPwcChoices2Element;
    new (): HTMLPwcChoices2Element;
  };

  interface HTMLPwcChoices2DropdownElement extends Components.PwcChoices2Dropdown, HTMLStencilElement {}
  var HTMLPwcChoices2DropdownElement: {
    prototype: HTMLPwcChoices2DropdownElement;
    new (): HTMLPwcChoices2DropdownElement;
  };

  interface HTMLPwcChoices2InputBarElement extends Components.PwcChoices2InputBar, HTMLStencilElement {}
  var HTMLPwcChoices2InputBarElement: {
    prototype: HTMLPwcChoices2InputBarElement;
    new (): HTMLPwcChoices2InputBarElement;
  };

  interface HTMLPwcChoices2OptionBubbleElement extends Components.PwcChoices2OptionBubble, HTMLStencilElement {}
  var HTMLPwcChoices2OptionBubbleElement: {
    prototype: HTMLPwcChoices2OptionBubbleElement;
    new (): HTMLPwcChoices2OptionBubbleElement;
  };
  interface HTMLElementTagNameMap {
    'pwc-choices-2': HTMLPwcChoices2Element;
    'pwc-choices-2-dropdown': HTMLPwcChoices2DropdownElement;
    'pwc-choices-2-input-bar': HTMLPwcChoices2InputBarElement;
    'pwc-choices-2-option-bubble': HTMLPwcChoices2OptionBubbleElement;
  }
}

declare namespace LocalJSX {
  interface PwcChoices2 {
    /**
    * If true, the placeholder will be hidden if there are selected options.
    */
    'autoHidePlaceholder'?: boolean;
    'dropdownIsOpen'?: boolean;
    /**
    * If not undefined, this will be displayed in dropdown instead of the default text when there are no options left to choose.
    */
    'noOptionsString'?: string;
    'options'?: PwcChoices2.IOption[] | string;
    'placeholder'?: string;
    /**
    * If true, selected option bubbles will have close buttons.
    */
    'showCloseButtons'?: boolean;
    'type'?: "single" | "multi";
    /**
    * If true, the option will be removed from available options after selection.
    */
    'uniqueSelections'?: boolean;
  }
  interface PwcChoices2Dropdown {
    'noOptionsString'?: string;
    'onDropdownOptionClicked'?: (event: CustomEvent<PwcChoices2.IDropdownOptionClickedEventPayload>) => void;
    'options'?: PwcChoices2.IOption[];
  }
  interface PwcChoices2InputBar {
    'autoHidePlaceholder'?: boolean;
    'onInputBarClicked'?: (event: CustomEvent<PwcChoices2.IInputBarClickedEventPayload>) => void;
    'onOptionDiscarded'?: (event: CustomEvent<PwcChoices2.IOptionDiscardedEventPayload>) => void;
    'options'?: PwcChoices2.IOption[];
    'placeholder'?: string;
    'showCloseButtons'?: boolean;
  }
  interface PwcChoices2OptionBubble {
    'indexInSelectedList'?: number;
    'onCloseClicked'?: (event: CustomEvent<PwcChoices2.IOptionBubbleCloseClickedEventPayload>) => void;
    'option'?: PwcChoices2.IOption;
    'showCloseButton'?: boolean;
  }

  interface IntrinsicElements {
    'pwc-choices-2': PwcChoices2;
    'pwc-choices-2-dropdown': PwcChoices2Dropdown;
    'pwc-choices-2-input-bar': PwcChoices2InputBar;
    'pwc-choices-2-option-bubble': PwcChoices2OptionBubble;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'pwc-choices-2': LocalJSX.PwcChoices2 & JSXBase.HTMLAttributes<HTMLPwcChoices2Element>;
      'pwc-choices-2-dropdown': LocalJSX.PwcChoices2Dropdown & JSXBase.HTMLAttributes<HTMLPwcChoices2DropdownElement>;
      'pwc-choices-2-input-bar': LocalJSX.PwcChoices2InputBar & JSXBase.HTMLAttributes<HTMLPwcChoices2InputBarElement>;
      'pwc-choices-2-option-bubble': LocalJSX.PwcChoices2OptionBubble & JSXBase.HTMLAttributes<HTMLPwcChoices2OptionBubbleElement>;
    }
  }
}


