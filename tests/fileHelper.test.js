/**
 * @file      fileHelper.test.js
 * @brief     This class is designed to test the behaviour of {@link
    *     FileHelper}.
 * @author    Created by Yannick.BAUDRAZ
 * @version   28-MAR-2022 - original
 */

'use strict';

const fs = require('fs');
const FileHelper = require('../src/FileHelper');
const FileEmptyException = require('../src/EmptyFileException');
const FileNotFoundException = require('../src/FileNotFoundException');

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
    for (let i = 0; i < expectedAmountOfLines; i++) {
      fs.appendFileSync(path + '/' + fileName, `${i}\n`);
    }
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
    fileHelper = new FileHelper(path, fileName);

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
    const expectedLinesPerFiles = amountOfLinesInOriginalFile /
        expectedAmountOfResultFiles;

    for (let i = 0; i < amountOfLinesInOriginalFile; i++) {
      fs.appendFileSync(path + '/' + fileName, `${i}\n`);
    }

    fileHelper = new FileHelper(path, fileName);
    fileHelper.extractFileContent();

    //when
    fileHelper.split(expectedLinesPerFiles);
    const liftOfFilesResult = fs.readdirSync(path).
        filter(fn => fn.endsWith('.csv'));

    //then
    expect(expectedAmountOfResultFiles).toEqual(liftOfFilesResult.length);
  });

  afterEach(() => {
    fs.readdirSync(__dirname).
        filter(file => file.endsWith('.csv')).
        forEach(file => fs.unlinkSync(path + '/' + file));
  });
});
