class FileOperation {

    static get RootDir() {
        return cordova.file.dataDirectory;
    }



    constructor(_filename) {
        this.FileName = _filename;
        this.FileEntry = null;
        this.FileSystem = null;
        this.GetFileSystem();
        console.log(this.FileSystem);
        

    }


    GetFileSystem() {
        console.log("file system");
        console.log(cordova.file);
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, GetDirectorySuccess);

        function GetDirectorySuccess(dir) {
            console.log("got main dir", dir);
            dir.getFile("log.txt", { create: true }, function (file) {
                console.log("got the file", file);
                logOb = file;
                writeLog("App started");
            });
        }




       // console.log(cordova.file)


    }


    CreateFile() {
        //window.resolveLocalFileSystemURL(FileOperation.RootDir, function (dir) {
        //    dir.getFile(filename, { create: true }, function (fileEntry) {
        //        // The file has been succesfully created. Use fileEntry to read the content or delete the file
        //    });
    }


    WriteFile() {

    }

    DeleteFile() {

    }


}