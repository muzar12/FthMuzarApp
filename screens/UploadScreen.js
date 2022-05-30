import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Button,
  Platform,
  useWindowDimensions,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from 'expo-status-bar';
import { IconButton } from '../components';
import firebase from "../config/firebase";
import { AntDesign, Feather } from "@expo/vector-icons";
import uplodImageFromDevice from "../photoUpload/uploadImageFromDevice";
import getBlobFromUri from "../photoUpload/getBlobFromUri";
import manageFileUpload from "../photoUpload/manageFileUpload";
import Firebase from '../config/firebase';

const auth = Firebase.auth();

export default function UploadScreen({ navigation }) {
  const [imgURI, setImageURI] = React.useState(null);

  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [remoteURL, setRemoteURL] = React.useState("");

  const [error, setError] = React.useState(null);
  const { width } = useWindowDimensions();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  }

  const handleLocalImageUpload = async () => {
    const fileURI = await uplodImageFromDevice();

    if (fileURI) {
      setImageURI(fileURI);
    }
  };

  const onStart = () => {
    setIsUploading(true);
  };

  const onProgress = (progress) => {
    setProgress(progress);
  };
  const onComplete = (fileUrl) => {
    setRemoteURL(fileUrl);
    setIsUploading(false);
    setImageURI(null);
  };

  const onFail = (error) => {
    setError(error);
    setIsUploading(false);
  };
  const handleCloudImageUpload = async () => {
    if (!imgURI) return;

    let fileToUpload = null;

    const blob = await getBlobFromUri(imgURI);

    await manageFileUpload(blob, { onStart, onProgress, onComplete, onFail });
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        <IconButton
          name='leftcircle'
          size={24}
          color='#fff'
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Naloži napotnico</Text>
        <IconButton
          name='logout'
          size={24}
          color='#fff'
          onPress={handleSignOut}
        />
      </View>
      <View style={styles.container1}>
        <View style={styles.row}>
          <Text style={styles.title}>Izberite sliko in jo naložite</Text>
        </View>
      
      {Boolean(imgURI) && (
        <View style={styles.row1}>
          <Image
            source={{ uri: imgURI }}
            resizeMode="contain"
            style={{ width, height: width }}
          />
        </View>
      )}
      </View>
      {!isUploading && (
        <View style={styles.row}>
          <AntDesign
            name="addfile"
            size={36}
            color={imgURI ? "green" : "black"}
            onPress={handleLocalImageUpload}
          />

          {Boolean(imgURI) && (
            <Feather
              name="upload-cloud"
              size={36}
              color="black"
              justifyContent="center"
              alignItems="center"
              onPress={handleCloudImageUpload}
            />
          )}
        </View>
      )}

      {isUploading && (
        <View style={styles.uploadProgressContainer}>
          <Text> Upload {progress} of 100% </Text>
        </View>
      )}

      {Boolean(remoteURL) && (
        <View style={{ paddingVertical: 20 }}>
          <Text style={styles.text}>
            Slika je naložena. Pritisnite nazaj!
          </Text>
          <Button title="Nazaj" onPress={() => navigation.navigate('Napotnica')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#DDDDDD',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  row1: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 24
  },
  uploadProgressContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    margin: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    alignItems: "center",
    textAlign: "center",
    color: '#fff'
  },
  text: {
    fontSize: 20,
    alignItems: "center",
    textAlign: "center",
    fontWeight: 'normal',
    color: '#000'
  }
});