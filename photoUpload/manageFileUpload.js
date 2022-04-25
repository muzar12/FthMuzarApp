import firebase from "firebase";

const auth = firebase.auth();

const manageFileUpload = async (
  fileBlob,
  { onStart, onProgress, onComplete, onFail }
) => {

  const imgName = auth.currentUser.uid + "_" + Date.now();
 
   const storageRef = firebase.storage().ref(`images/${imgName}.jpg`);

   console.log('uploading file',imgName)

  // Create file metadata including the content type
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };

  // Trigger file upload start event
  onStart && onStart();
  const uploadTask = storageRef.put(fileBlob, metadata);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
      // Monitor uploading progress
      onProgress && onProgress(Math.fround(progress).toFixed(2));

    },
    (error) => {

      // Something went wrong - dispatch onFail event with error  response
      onFail && onFail(error);
      console.log("E jebiga !" + error)

    },
    () => {
      // Upload completed successfully, now we can get the download URL

      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        // dispatch on complete event
        onComplete && onComplete(downloadURL);

        console.log("File available at", downloadURL);
      });
    
    }
  );
};

export default manageFileUpload 