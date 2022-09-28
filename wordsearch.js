#!/bin/node
/*
 * Import the glob library for system IO.
 *
 * You must install the package.json file using `npm --init`, then install glob, to run this script.
 *
 * Syntax: node wordsearch.js [wordcount] [path]
 * eg. node wordsearch.js 12 /storage
 *
 * Matches will be stored in the `wordsearch_matches.log` file.
 */
const glob = require("glob");
const fs = require("fs");
const exec = require("child_process").execSync;
const path = require("path");

var colors = {
  /**
   * Sets the text background color value between 0(black) and 256(white). If the range value is outside
   * a valid range, the background will be black.
   *
   * @param text - The text string
   * @param range - The background color.
   */
  ByColorValue_Bg(text, range = 256) {
    const colorValue = range >= 0 && range <= 256 ? range : 0;

    return `\x1b[48;5;${colorValue},m${text}\x1b[0m`;
  },
  /**
   * Sets the text forground color to a color value between 0(black) and 256(white). If the range
   * value is outside the expected range, the color will be white. You can easily find the chart using
   * a search engine.
   *
   * @param text - The string value
   * @param range - The number color value(0 - 256)
   */
  ByColorValue(text, range = 256) {
    const colorValue = range >= 0 && range <= 256 ? range : 256;

    return `\x1b[38;5;${colorValue}m${text}\x1b[0m`;
  },
  /**
   * Prints text output in an error format. Black bold text, red background.
   *
   * @param text - Text
   * @returns text
   */
  ErrorType(text) {
    return ByColorValue_Bg(Thicc(Black(text)), 1);
  },
  /**
   * Same as  ErrorType() expect causes the text to blink.
   *
   * @param text
   * @returns text
   */
  ErrorTypeFlash(text) {
    return Blink(ByColorValue_Bg(Thicc(Black(text)), 1));
  },
  /**
   * Prints the text in bold yellow.
   *
   * @param text
   * @returns text
   */
  WarningType(text) {
    return Yellow(Thicc(text));
  },
  /**
   * Prints bold text
   * @param text - The text string
   */
  Thicc(text) {
    return `\x1b[1m${text}\x1b[0m`;
  },
  /**
   * Dimms some text
   * @param text - The text string
   */
  Dimm(text) {
    return `\x1b[2m${text}\x1b[0m`;
  },
  /**
   * Dimms some text
   * @param text - The text string
   */
  Underline(text) {
    return `\x1b[4m${text}\x1b[0m`;
  },
  /**
   * Prints bold text
   * @param text - The text string
   */
  Blink(text) {
    return `\x1b[5m${text}\x1b[0m`;
  },
  /**
   * Prints bold text
   * @param text - The text string
   */
  Invert(text) {
    return `\x1b[7m${text}\x1b[0m`;
  },
  /**
   * Black coloured text.
   * @param text - The text string
   */
  Black(text) {
    return ByColorValue(text, 0);
  },
  /**
   * Red coloured text.
   * @param text - The text string
   */
  Red(text) {
    return this.ByColorValue(text, 1);
  },
  /**
   * Green colored text.
   * @param text - The text string
   */
  Green(text) {
    return this.ByColorValue(text, 2);
  },
  /**
   * Yellow colored text.
   * @param text - The text string
   */
  Yellow(text) {
    return this.ByColorValue(text, 3);
  },
  /**
   * Blue colored text.
   * @param text - The text string
   */
  Blue(text) {
    return this.ByColorValue(text, 4);
  },
  /**
   * Magenta colored text
   * @param text - The text string
   */
  Magenta(text) {
    return this.ByColorValue(text, 5);
  },
  /**
   * Cyan colored text
   * @param text - The text string
   */
  Cyan(text) {
    return this.ByColorValue(text, 6);
  },
  /**
   * LightGray colored text
   * @param text - The text string
   */
  LightGray(text) {
    return this.ByColorValue(text, 7);
  },
  /**
   * DarkGray colored text
   * @param text - The text string
   */
  DarkGray(text) {
    return this.ByColorValue(text, 8);
  },
  /**
   * Red coloured text.
   * @param text - The text string
   */
  BrightRed(text) {
    return this.ByColorValue(text, 9);
  },
  /**
   * Light green colored text.
   * @param text - The text string
   */
  BrightGreen(text) {
    return this.ByColorValue(text, 10);
  },
  /**
   * LightYellow colored text.
   * @param text - The text string
   */
  BrightYellow(text) {
    return this.ByColorValue(text, 11);
  },
  /**
   * BrightBlue colored text.
   * @param text - The text string
   */
  BrightBlue(text) {
    return this.ByColorValue(text, 12);
  },
  /**
   * BrightMagenta colored text.
   * @param text - The text string
   */
  BrightMagenta(text) {
    return this.ByColorValue(text, 13);
  },
  /**
   * BrightCyan colored text.
   * @param text - The text string
   */
  BrightCyan(text) {
    return this.ByColorValue(text, 14);
  },
  /**
   * PureWhite colored text.
   * @param text - The text string
   */
  PureWhite(text) {
    return this.ByColorValue(text, 15);
  },
  /**
   * Orange colored text.
   * @param text - The text string
   */
  Orange(text) {
    return this.ByColorValue(text, 202);
  },
  /**
   * Pink rose colored text.
   * @param text - The text string
   */
  PinkRose(text) {
    return this.ByColorValue(text, 204);
  },
  /**
   * Pink rose colored text.
   * @param text - The text string
   */
  Crimson(text) {
    return this.ByColorValue(text, 124);
  },
};
/*
 *
 */
const wordSearchLog = "wordsearch_matches.log";
/*
 * Fetches all directories and files relative to source.
 */
const getDirectories = (src, callback) => {
  glob(src + "/**/*", callback);
};
/*
 *
 */
const main = () => {
  console.log(
    colors.Green(
      "#####################################################################"
    )
  );
  console.log(
    colors.Green(
      "------------------ SYSTEM SEARCH SCRIPT Version 1.0 -----------------"
    )
  );
  console.log(
    colors.Green(
      "#####################################################################"
    )
  );
  console.log(
    colors.Red(
      "This script may take a while to locate the files you're looking for. Do not close this tab until completion."
    )
  );
  /*
   * Parse the startup arguments.
   *
   * The number of words is the first argument.
   */
  const wordCount = process.argv[2];
  /*
   * The directory is the second argument.
   */
  const directory = process.argv[3];
  /*
   *
   */
  if (wordCount === undefined || directory === undefined) {
    console.log(colors.Red("Invalid syntax: index.js [wordCount] [path]"));
    return process.exit(1);
  }
  /*
   *
   */
  if (!fs.existsSync(directory)) {
    console.log(
      colors.Red(
        `The provided directory ${colors.Yellow(directory)} does not exist.\n`
      )
    );
    return process.exit(1);
  }
  /*
   *
   */
  console.log(
    `Searching directory ${colors.Green(
      directory
    )} recursively, and searching for files with a word count of ${colors.Green(
      wordCount
    )}.`
  );
  /*
   * Fetch the input directory.
   */
  getDirectories(directory, function (err, res) {
    if (err) {
      console.log("Error", colors.Red(err));
    } else {
      /*
       * Truncate the log and create a new one.
       */
      if (fs.existsSync(wordSearchLog)) fs.truncateSync(wordSearchLog, 0);
      /*
       *
       */
      const date = new Date();
      /*
       * A welcome log message!
       */
      fs.appendFileSync(
        wordSearchLog,
        "Starting new log " +
          date.toDateString() +
          " - " +
          date.toTimeString() +
          "\n This log only shows matches.\n\n"
      );
      /*
       *
       */
      console.log(
        colors.Red(
          `Processing directory structure with ${colors.Green(
            res.length
          )} ${colors.Red("entries")}.`
        ),
        "Depending on your system this may take a long while.\n"
      );

      var index = 0,
        matches = 0;

      while (index < res.length) {
        /*
         *
         */
        const fileIndex = res[index];
        /*
         *
         */
        try {
          /*
           * We have to make sure this is a file.
           */
          const dataType = fs.statSync(fileIndex);
          /*
           *
           */
          if (dataType.isFile()) {
            /*
             * Ignore these.
             */
            if (
              [
                ".jpg",
                ".png",
                ".jpeg",
                ".mpg",
                ".mpv",
                ".gif",
                ".wav",
                ".mp3",
                ".mov",
              ].includes(path.extname(fileIndex))
            ) {
              index++;
              continue;
            }
            /*
             * Run the 'wc' command to get the word count.
             */
            const oVar = exec(`wc -w "${fileIndex}"`).toString();
            /*
             * Make sure we have a white space and the file isn't empty.
             */
            if (oVar.indexOf(" ") !== -1) {
              /*
               * Split the line output by a white space, get the first index, and convert to a number.
               *
               * wc outputs the data like [count] [file]
               *
               */
              const number = +oVar.split(" ")[0];
              /*
               * Check if the word count matches the word could we're needing.
               */
              if (+number === +wordCount) {
                matches++;
                /*
                 *
                 */
                fs.appendFileSync(
                  "wordsearch_matches.log",
                  `[MATCH] Discovered possible match: (${number} = ${wordCount}) ` +
                    fileIndex +
                    "\n"
                );

                console.log(
                  colors.Thicc(
                    colors.Green(
                      `[MATCH] Discovered possible match: (${number} = ${wordCount}) `
                    ) + fileIndex
                  )
                );
              }
            }
          }
        } catch (e) {
          console.log(
            colors.Yellow(
              `[WARNING]: Unable to access part of path ${fileIndex}`
            )
          );
        }
        ++index;
      }
      /*
       *
       */
      if (matches !== 0)
        console.log(
          "\nOperation completed with",
          colors.Green(matches),
          "matches.\n"
        );
      else {
        console.log(
          "Operation completed with",
          colors.Red(matches),
          "matches. :(\n"
        );
      }
    }
  });
};

main();
