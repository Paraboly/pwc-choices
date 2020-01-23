/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  PwcChoicesInterfaces,
} from './interfaces/pwc-choices-interfaces';

export namespace Components {
  interface PwcChoices {
    /**
    * If true, the placeholder will be hidden if there are selected options.
    */
    'autoHidePlaceholder': boolean;
    /**
    * This is the mode of filtering we use to make given option objects distinct.
    */
    'distinctMode': PwcChoicesInterfaces.DistinctMode;
    'dropdownIsOpen': boolean;
    'getSelectedOptions': (mode?: "value" | "label" | "option") => Promise<PwcChoicesInterfaces.IOption[] | string[]>;
    'name': string;
    /**
    * This will be displayed in the dropdown when there are no options left to choose.
    */
    'noOptionsString': string;
    'options': PwcChoicesInterfaces.IOption[] | string;
    'placeholder': string;
    /**
    * If true, selected option bubbles will have close buttons.
    */
    'showCloseButtons': boolean;
    'type': PwcChoicesInterfaces.Type;
    /**
    * If true, the option will be removed from available options after selection.
    */
    'uniqueSelections': boolean;
  }
  interface PwcChoicesDropdown {
    'noOptionsString': string;
    'options': PwcChoicesInterfaces.IOption[];
  }
  interface PwcChoicesInputBar {
    'autoHidePlaceholder': boolean;
    'options': PwcChoicesInterfaces.IOption[];
    'placeholder': string;
    'showCloseButtons': boolean;
    'type': "single" | "multi";
  }
  interface PwcChoicesOptionBubble {
    'indexInSelectedList': number;
    'option': PwcChoicesInterfaces.IOption;
    'showCloseButton': boolean;
  }
}

declare global {


  interface HTMLPwcChoicesElement extends Components.PwcChoices, HTMLStencilElement {}
  var HTMLPwcChoicesElement: {
    prototype: HTMLPwcChoicesElement;
    new (): HTMLPwcChoicesElement;
  };

  interface HTMLPwcChoicesDropdownElement extends Components.PwcChoicesDropdown, HTMLStencilElement {}
  var HTMLPwcChoicesDropdownElement: {
    prototype: HTMLPwcChoicesDropdownElement;
    new (): HTMLPwcChoicesDropdownElement;
  };

  interface HTMLPwcChoicesInputBarElement extends Components.PwcChoicesInputBar, HTMLStencilElement {}
  var HTMLPwcChoicesInputBarElement: {
    prototype: HTMLPwcChoicesInputBarElement;
    new (): HTMLPwcChoicesInputBarElement;
  };

  interface HTMLPwcChoicesOptionBubbleElement extends Components.PwcChoicesOptionBubble, HTMLStencilElement {}
  var HTMLPwcChoicesOptionBubbleElement: {
    prototype: HTMLPwcChoicesOptionBubbleElement;
    new (): HTMLPwcChoicesOptionBubbleElement;
  };
  interface HTMLElementTagNameMap {
    'pwc-choices': HTMLPwcChoicesElement;
    'pwc-choices-dropdown': HTMLPwcChoicesDropdownElement;
    'pwc-choices-input-bar': HTMLPwcChoicesInputBarElement;
    'pwc-choices-option-bubble': HTMLPwcChoicesOptionBubbleElement;
  }
}

declare namespace LocalJSX {
  interface PwcChoices {
    /**
    * If true, the placeholder will be hidden if there are selected options.
    */
    'autoHidePlaceholder'?: boolean;
    /**
    * This is the mode of filtering we use to make given option objects distinct.
    */
    'distinctMode'?: PwcChoicesInterfaces.DistinctMode;
    'dropdownIsOpen'?: boolean;
    'name'?: string;
    /**
    * This will be displayed in the dropdown when there are no options left to choose.
    */
    'noOptionsString'?: string;
    'onSelectedOptionsChanged'?: (event: CustomEvent<PwcChoicesInterfaces.IOption[]>) => void;
    'options'?: PwcChoicesInterfaces.IOption[] | string;
    'placeholder'?: string;
    /**
    * If true, selected option bubbles will have close buttons.
    */
    'showCloseButtons'?: boolean;
    'type'?: PwcChoicesInterfaces.Type;
    /**
    * If true, the option will be removed from available options after selection.
    */
    'uniqueSelections'?: boolean;
  }
  interface PwcChoicesDropdown {
    'noOptionsString'?: string;
    'onDropdownOptionClicked'?: (event: CustomEvent<PwcChoicesInterfaces.IDropdownOptionClickedEventPayload>) => void;
    'options'?: PwcChoicesInterfaces.IOption[];
  }
  interface PwcChoicesInputBar {
    'autoHidePlaceholder'?: boolean;
    'onInputBarClicked'?: (event: CustomEvent<PwcChoicesInterfaces.IInputBarClickedEventPayload>) => void;
    'onOptionDiscarded'?: (event: CustomEvent<PwcChoicesInterfaces.IOptionDiscardedEventPayload>) => void;
    'options'?: PwcChoicesInterfaces.IOption[];
    'placeholder'?: string;
    'showCloseButtons'?: boolean;
    'type'?: "single" | "multi";
  }
  interface PwcChoicesOptionBubble {
    'indexInSelectedList'?: number;
    'onCloseClicked'?: (event: CustomEvent<PwcChoicesInterfaces.IOptionBubbleCloseClickedEventPayload>) => void;
    'option'?: PwcChoicesInterfaces.IOption;
    'showCloseButton'?: boolean;
  }

  interface IntrinsicElements {
    'pwc-choices': PwcChoices;
    'pwc-choices-dropdown': PwcChoicesDropdown;
    'pwc-choices-input-bar': PwcChoicesInputBar;
    'pwc-choices-option-bubble': PwcChoicesOptionBubble;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'pwc-choices': LocalJSX.PwcChoices & JSXBase.HTMLAttributes<HTMLPwcChoicesElement>;
      'pwc-choices-dropdown': LocalJSX.PwcChoicesDropdown & JSXBase.HTMLAttributes<HTMLPwcChoicesDropdownElement>;
      'pwc-choices-input-bar': LocalJSX.PwcChoicesInputBar & JSXBase.HTMLAttributes<HTMLPwcChoicesInputBarElement>;
      'pwc-choices-option-bubble': LocalJSX.PwcChoicesOptionBubble & JSXBase.HTMLAttributes<HTMLPwcChoicesOptionBubbleElement>;
    }
  }
}


