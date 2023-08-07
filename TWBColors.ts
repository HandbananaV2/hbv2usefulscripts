/**
 * A custom library which was created to replace the Colors NPM module which
 * has been corrupted. This is a basic library. Don't expect anything else.
 */
namespace API_Colors {
  /**
   * Sets the text background color value between 0(black) and 256(white). If the range value is outside
   * a valid range, the background will be black.
   *
   * @param text - The text string
   * @param range - The background color.
   */
  export function ByColorValue_Bg(text: string, range: number = 256) {
    const colorValue = range >= 0 && range <= 256 ? range : 0;

    return `\x1b[48;5;${colorValue}m${text}\x1b[0m`;
  }
  /**
   * Sets the text forground color to a color value between 0(black) and 256(white). If the range
   * value is outside the expected range, the color will be white. You can easily find the chart using
   * a search engine.
   *
   * @param text - The string value
   * @param range - The number color value(0 - 256)
   */
  export function ByColorValue(text: string, range: number = 256) {
    const colorValue = range >= 0 && range <= 256 ? range : 256;

    return `\x1b[38;5;${colorValue}m${text}\x1b[0m`;
  }
  /**
   * Prints text output in an error format. Black bold text, red background.
   *
   * @param text - Text
   * @returns text
   */
  export function ErrorType(text: string) {
    return ByColorValue_Bg(Thicc(Black(text)), 1);
  }
  /**
   * Same as function ErrorType() expect causes the text to blink.
   *
   * @param text
   * @returns text
   */
  export function ErrorTypeFlash(text: string) {
    return Blink(ByColorValue_Bg(Thicc(Black(text)), 1));
  }
  /**
   * Prints the text in bold yellow.
   *
   * @param text
   * @returns text
   */
  export function WarningType(text: string) {
    return Yellow(Thicc(text));
  }
  /**
   * Prints bold text
   * @param text - The text string
   */
  export function Thicc(text: string) {
    return `\x1b[1m${text}\x1b[0m`;
  }
  /**
   * Dimms some text
   * @param text - The text string
   */
  export function Dimm(text: string) {
    return `\x1b[2m${text}\x1b[0m`;
  }
  /**
   * Dimms some text
   * @param text - The text string
   */
  export function Underline(text: string) {
    return `\x1b[4m${text}\x1b[0m`;
  }
  /**
   * Prints bold text
   * @param text - The text string
   */
  export function Blink(text: string) {
    return `\x1b[5m${text}\x1b[0m`;
  }
  /**
   * Prints bold text
   * @param text - The text string
   */
  export function Invert(text: string) {
    return `\x1b[7m${text}\x1b[0m`;
  }
  /**
   * Black coloured text.
   * @param text - The text string
   */
  export function Black(text: string) {
    return ByColorValue(text, 0);
  }
  /**
   * Red coloured text.
   * @param text - The text string
   */
  export function Red(text: string) {
    return ByColorValue(text, 1);
  }
  /**
   * Green colored text.
   * @param text - The text string
   */
  export function Green(text: string) {
    return ByColorValue(text, 2);
  }
  /**
   * Yellow colored text.
   * @param text - The text string
   */
  export function Yellow(text: string) {
    return ByColorValue(text, 3);
  }
  /**
   * Blue colored text.
   * @param text - The text string
   */
  export function Blue(text: string) {
    return ByColorValue(text, 4);
  }
  /**
   * Magenta colored text
   * @param text - The text string
   */
  export function Magenta(text: string) {
    return ByColorValue(text, 5);
  }
  /**
   * Cyan colored text
   * @param text - The text string
   */
  export function Cyan(text: string) {
    return ByColorValue(text, 6);
  }
  /**
   * LightGray colored text
   * @param text - The text string
   */
  export function LightGray(text: string) {
    return ByColorValue(text, 7);
  }
  /**
   * DarkGray colored text
   * @param text - The text string
   */
  export function DarkGray(text: string) {
    return ByColorValue(text, 8);
  }
  /**
   * Red coloured text.
   * @param text - The text string
   */
  export function BrightRed(text: string) {
    return ByColorValue(text, 9);
  }
  /**
   * Light green colored text.
   * @param text - The text string
   */
  export function BrightGreen(text: string) {
    return ByColorValue(text, 10);
  }
  /**
   * LightYellow colored text.
   * @param text - The text string
   */
  export function BrightYellow(text: string) {
    return ByColorValue(text, 11);
  }
  /**
   * BrightBlue colored text.
   * @param text - The text string
   */
  export function BrightBlue(text: string) {
    return ByColorValue(text, 12);
  }
  /**
   * BrightMagenta colored text.
   * @param text - The text string
   */
  export function BrightMagenta(text: string) {
    return ByColorValue(text, 13);
  }
  /**
   * BrightCyan colored text.
   * @param text - The text string
   */
  export function BrightCyan(text: string) {
    return ByColorValue(text, 14);
  }
  /**
   * PureWhite colored text.
   * @param text - The text string
   */
  export function PureWhite(text: string) {
    return ByColorValue(text, 15);
  }
  /**
   * Orange colored text.
   * @param text - The text string
   */
  export function Orange(text: string) {
    return ByColorValue(text, 202);
  }
  /**
   * Pink rose colored text.
   * @param text - The text string
   */
  export function PinkRose(text: string) {
    return ByColorValue(text, 204);
  }
  /**
   * Pink rose colored text.
   * @param text - The text string
   */
  export function Crimson(text: string) {
    return ByColorValue(text, 124);
  }
  /**
   *
   */
  export function PrintAsError(text: string, thicc: boolean = false) {
    thicc
      ? console.error(API_Colors.Thicc(API_Colors.Red(text)))
      : console.error(API_Colors.Red(text));
  }
  /**
   *
   */
  export function PrintAsWarning(text: string, thicc: boolean = false) {
    thicc
      ? console.error(API_Colors.Thicc(API_Colors.Yellow(text)))
      : console.error(API_Colors.Yellow(text));
  }
  /**
   *
   */
  export function PrintAsNotification(text: string, thicc: boolean = false) {
    thicc
      ? console.error(API_Colors.Thicc(API_Colors.PureWhite(text)))
      : console.error(API_Colors.PureWhite(text));
  }
}

export default API_Colors;
