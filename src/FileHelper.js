/**
 * @file      FileHelper.js
 * @brief     This class is designed to manage a file.
 * @author    Created by Yannick.BAUDRAZ
 * @version   28-MAR-2022 - original
 */

'use strict';

const fs = require('fs');
const FileNotFoundException = require('./FileNotFoundException');
const EmptyFileException = require('./EmptyFileException');

module.exports = class FileHelper {
  //region private attributes

  #lines;
  #dirName;
  #fullPath;

  //endregion

  /**
   * @description This methods constructs an instance of the FileHelper class.
   * @param {string} path - Path to the file.
   * @param {string} name - Name of the file.
   * @throw {FileNotFoundException} - If the full path doesn't exist
   */
  constructor(path, name) {
    this.#dirName = path;
    this.#fullPath = `${path}/${name}`;

    if (!fs.existsSync(this.#fullPath)) {
      throw new FileNotFoundException(this.#fullPath);
    }

    this.#lines = fs.readFileSync(this.#fullPath, 'utf8').split('\n');
  }

  /**
   * @description This accessors returns the file's content
   * @return {string[]}
   */
  get lines() {
    return this.#lines;
  }

  /**
   * @description This method extracts and delivers the file's content in
   *     setting the private attribut "lines". Except if an exception is
   *     thrown, a 20 lines file extracted will inject
   * 20 strings in the private attribut "lines".
   * @throw {EmptyFileException} - If the file is empty.
   */
  extractFileContent() {
    const file = fs.readFileSync(this.#fullPath, 'utf8');
    if (!file.length) {
      throw new EmptyFileException();
    }
    this.#lines = file.split('\n').filter(Boolean);
  }

  /**
   * @description This method splits the original content (lines) in several
   *     files. Files name output pattern : Split*.csv (* -> number of the
   *     file, Split01.csv, Split02.csv).
   * @param {number} fileSize
   */
  split(fileSize) {
    const fileNumber = Math.ceil(this.#lines.length / fileSize);
    for (let i = 0; i < fileNumber; i++) {
      const fileName = `Split${i + 1}.csv`;
      const fileContent = this.#lines.slice(i * fileSize, (i + 1) * fileSize);
      fs.writeFileSync(`${this.#dirName}/${fileName}`, fileContent.join('\n'),
          'utf8');
    }
    fs.unlinkSync(this.#fullPath);
  }
};
