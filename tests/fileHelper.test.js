/**
 * @file      fileHelper.test.js
 * @brief     This class is designed to test the behaviour of {@link FileHelper}.
 * @author    Created by Yannick.BAUDRAZ
 * @version   28-MAR-2022 - original
 */

'use strict';

const fs = require('fs');
const FileHelper = require('../src/FileHelper');
const FileEmptyException = require('../src/EmptyFileException');
const FileNotFoundException = require('../src/FileNotFoundException');
const assert = require('assert');

describe('FileHelper', () => {
  //region private attributs
  /**
   * @type {FileHelper}
   */
  let fileHelper;
  let path = __dirname;
  let fileName = 'testFile.csv';
  //endregion

  beforeEach(() => {
    const fullPath = path + '/' + fileName;
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    fs.closeSync(fs.openSync(fullPath, 'a'));
  });

  test('Constructor_NominalCase_Success', () => {
    //given
    //refer to Init() method
    const expectedAmountOfLines = 20;
    const file = fs.createWriteStream(path + '/' + fileName);
    for (let i = 0; i < expectedAmountOfLines; i++) {
      file.write(`${i}\n`);
    }
    file.close();
    fileHelper = new FileHelper(path, fileName);
    fileHelper.extractFileContent();

    //when
    const lines = fileHelper.lines;

    //then
    expect(lines).toHaveLength(expectedAmountOfLines);
  });

  test('Constructor_InexistingFile_ThrowException', () => {
    //given
    const wrongPath = 'falkjalj';
    const wrongFileName = 'wrong.csv';

    //when
    expect(() => {
      new FileHelper(wrongPath, wrongFileName);
    }).toThrow(FileNotFoundException);

    //then
    //exception thrown
  });

  test('Constructor_FileEmpty_ThrowException', () => {
    //given
    //refer to Init() method
    new FileHelper(path, fileName);

    //when
    expect(() => {
      fileHelper.extractFileContent();
    }).toThrow(FileEmptyException);

    //then
    //exception thrown
  });

  test('Split_OnlyOneBigFile_Success', () => {
    //given
    //refer to Init()
    const amountOfLinesInOriginalFile = 400;
    const expectedAmountOfResultFiles = 2;
    const expectedLinesPerFiles = amountOfLinesInOriginalFile
        / expectedAmountOfResultFiles;
    const file = fs.createWriteStream(path + '/' + fileName);

    for (let i = 0; i < amountOfLinesInOriginalFile; i++) {
      file.write(`${i}\n`);
    }
    file.close();

    fileHelper = new FileHelper(path, fileName);
    fileHelper.extractFileContent();

    //when
    fileHelper.split(expectedLinesPerFiles);
    const liftOfFilesResult = fs.readdirSync(path);

    //then
    expect(expectedAmountOfResultFiles).toEqual(liftOfFilesResult);
  });

  afterEach(() => {
    fs.readdirSync(__dirname).forEach(file => {
      if (file.includes('.csv')) {
        fs.unlinkSync(__dirname + '/' + file);
      }
    });
  });
});
