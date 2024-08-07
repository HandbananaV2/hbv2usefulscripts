/*
 * THIS SCRIPT IS LICENSED UNDER GPLv3.
 *
 * For more information visit: https://www.gnu.org/licenses/gpl-3.0.txt
 *
 * Written by Michael, mikeh@tweeby.ca
 *
 * Requires the email-validator node module for typescript.
 *
 * This library is a very simple chain based input validator. It takes an input and checks it against the provided
 * options. On error, the chain is broken and an error is sent back to the the error callback. If "present" is set when the callback
 * is triggerred then the function found a problem and further chain calls will not execute. You can use reset() to
 * reset these flags.
 *
 * This function is intended to be used within a chain for validation. The chainIndex sent to the error callback is the index
 * starting from the first requires() call to the last one.
 *
 * ErrorCallback takes three arguments:
 *
 *  1) A boolean signifying an error was sent.
 *  2) A string containing the error(or message) information if provided.
 *  3) A number indicating the index in the chain that triggerred the break.
 *
 * At the end of the chain, you must call end() which sends the signal to the error callback signifying no error has
 * occurred IF no erorr has occurred in the chain.
 * 
 * This function will only return one error at a time, beginning from the top.
 */
import EmailValidator from "email-validator";

/* */
export default class ComponentInputAnalyzer {
  public hasError: boolean = false;
  public chainIndex: number = 0; // Tells us which index on the chain broke.
  /* */
  errorCb: (present: boolean, t?: string, chainIndex?: number) => void;
  /* */
  public reset() {
    this.hasError = false;
  }
  /* */
  constructor(
    error: (present: boolean, t?: string, chainIndex?: number) => void
  ) {
    this.errorCb = error;
    this.hasError = false;
  }
  /*
   * Triggers an error, and blocks further chain calls.
   */
  public triggerErrr(msg: string) {
    if (this.hasError) return; // Do not call twice.
    this.hasError = true;
    this.errorCb(true, msg);
  }
  /*
   * Called at the end of the requires() chain. Will only trigger if no errors
   * are thrown in the chain.
   */
  public end() {
    if (this.hasError) return this;

    this.errorCb(false);
  }
  /*
   * Adds a check to the chain.
   */
  public requires(
    input: any,
    options: {
      minLen?: undefined | number; // Min length
      maxLen?: undefined | number; // Max length
      type?: "string" | "number" | "exist" | "email" | "match"; // Type to expect
      msg?: undefined | string; // Message to display on error
      matches?: {
        inverted: boolean;
        match: RegExp;
      },
      matchField?: any | any[]; // Match field
    }
  ) {
    /* Do not continue the chain if we've errored out. Reset will disable the flag. */
    if (this.hasError) return this;
    /* The type that our input field is */
    const typeO = typeof input;
    /* The type that the field must be to pass the check. */
    const typeRequired = options.type || "string";
    /*
     * This checks if the field value matches the field value(s) of others. If 'matches' is set though,
    * it will use the RegExp value to validate the input instead.
    * 
    * By default the function will fail if the expression does not match. If 'inverted' is set to true, the function
    * will fail if it finds a match instead.
     */
    if (options.type === "match") {
      if (options.matches) {
        if (options.matches.inverted) {
          if (options.matches.match.test(input)) {
            /* */
            this.triggerErrr(
              options.msg ??
              `Input string does not match regular expression: ${options.matches}`
            );
          }
        }
        else if (!options.matches.match.test(input)) {
            /* */
            this.triggerErrr(
              options.msg ??
              `Input string does not match regular expression: ${options.matches}`
            );
          }
        
      }
      else {
        /* */
        if (Array.isArray(options.matchField)) {
          for (const item of options.matchField) {
            if (item !== input) {
              this.triggerErrr(
                options.msg ??
                "One or more of the match field(s) do not match the input field value or type."
              );
              break;
            }
          }
        } else if (input !== options.matchField) {
          this.triggerErrr(
            options.msg ?? "Input field does not match secondary match field."
          );
        }
      }
    } else if (typeRequired === "string" || typeRequired === "email") {
      /*
       * Performs typechecks or string types. Emails are also strings.
       */
      if (typeO !== "string") {
        /* */
        this.triggerErrr(
          options.msg ?? `Input expects string type, but received type ${typeO}`
        );
      }
      /* If we're asked to check string for an email type, validate it */
      if (typeRequired === "email" && !EmailValidator.validate(input)) {
        /* */
        this.triggerErrr(
          options.msg ??
          `Input expects email, but the provided input is malformed.`
        );
      }
      /* Check min length */
      if (options.minLen !== undefined) {
        const t = input as string;
        const l = options.minLen as number;
        /* */
        if (t.length < l) {
          /* */
          this.triggerErrr(
            options.msg ??
            `Input string is shorter than minLength, minLength: ${options.minLen}`
          );
        }
      }
      /* Check max length */
      if (options.maxLen !== undefined) {
        /* Check max length */
        const t = input as string;
        const l = options.maxLen as number;
        /* */
        if (t.length > l) {
          /* */
          this.triggerErrr(
            options.msg ??
            `Input string is longer than maxLength, maxLength: ${options.maxLen}`
          );
        }
      }
    } else if (typeRequired === "number") {
      /*
       * Performs typechecks for numeric inputs.
       */
      if (typeO !== "number" || isNaN(input)) {
        /* */
        this.triggerErrr(
          options.msg ?? `Input expects a number, but received type ${typeO}`
        );
      }
      /* Check for value range */
      if (options.minLen !== undefined || options.maxLen !== undefined) {
        /* */
        const n = input as number;
        const max = options.maxLen as number;
        const min = options.minLen as number;
        /* Check the value range.  */
        if (options.maxLen !== undefined && n > max) {
          /* */
          this.triggerErrr(
            options.msg ??
            `Input expects a number between ${options.minLen} and ${options.maxLen}, but received ${n}`
          );
          /* */
        } else if (options.minLen !== undefined && n < min) {
          /* */
          this.triggerErrr(
            options.msg ??
            `Input expects a number between ${options.minLen} and ${options.maxLen}, but received ${n}`
          );
        }
      }
    }
    /* Tells us the index within the chain that failed. Increase it each call. */
    this.chainIndex++;
    /* */
    return this;
  }
}
