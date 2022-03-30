namespace TestFileszzzzz
{
    public class FileHelper
    {
        /// <summary>
        /// This methods constructs an instance of the FileHelper class.
        /// </summary>
        /// <param name="path">path to the file</param>
        /// <param name="fileName">name of the file to read</param>
        /// <exception cref="FileNotFoundException">Thrown when the full path doesn't exist</exception>
        public FileHelper(string path, string fileName)
        {
        }
        #endregion constructors

        #region accessors and mutators
        /// <summary>
        /// This accessors returns the file's content
        /// </summary>
        public List<string> Lines { get => lines; }
        #endregion accessors and mutators

        #region public methods
        /// <summary>
        /// This method extracts and delivers the file's content in setting the private attribut "lines".
        /// Except if an exception is thrown, a 20 lines file extracted will injected 20 strings in the privat attribut "lines".
        /// </summary>
        /// <exception cref="EmptyFileException">Thrown when the file is empty</exception>
        public virtual void ExtractFileContent()
        {
        }

        /// <summary>
        /// This method splits the original content (lines) in several files.
        /// The parameter "fileSize" defined the amount of lines per file.
        /// Files name output pattern : Split*.csv (* -> number of the file, Split01.csv, Split02.csv).
        /// </summary>
        /// <param name="fileSize">Amount of lines per file, after splitting</param>
        public void Split(int fileSize)
        {
        }
        #endregion public methods
    }
}

public class FileHelperException : Exception { }

public class EmptyFileException : FileHelperException { }