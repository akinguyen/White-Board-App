import * as React from "react";
import Constants from "expo-constants";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from "react-native";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import axios from "react-native-axios";

export default class Main extends React.Component {
  componentDidMount() {
    this.getPermissionAsync();
  }

  constructor() {
    super();
    this.state = {
      restart: false,
      hide: false,
      compiling: false,
      image: null,
      myoutput: "",
      camera: null,
      language: "",
      annotation: ""
    };
  }

  // input
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { statusCameraRoll } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);
    }
  };
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, restart: false });

      axios
        .post("https://hack-interview-api.herokuapp.com/api/upload", {
          data: result.base64
        })
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  _takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri, restart: false });

      axios
        .post("https://hack-interview-api.herokuapp.com/api/upload", {
          data: result.base64
        })
        .then(function(response) {
          console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  // output
  getOutput = async () => {
    var output = this.state.myoutput - 1;

    if (this.state.image != null) {
      try {
        if (this.state.restart) {
          this.setState({ compiling: true, restart: true });
          let response = await axios.post(
            "https://hack-interview-api.herokuapp.com/api/rerun",
            { code: this.state.annotation, language: this.state.language }
          );

          this.setState({
            myoutput: response.data.msg,
            compiling: false,
            annotation: response.data.annotation
          });
        } else {
          this.setState({ compiling: true, restart: true });
          let response = await axios.get(
            "https://hack-interview-api.herokuapp.com/api/" +
              this.state.language
          );

          this.setState({
            myoutput: response.data.msg,
            compiling: false,
            annotation: response.data.annotation
          });
        }
      } catch (error) {
        this.setState({ myoutput: "Compilation Error or invalid image" });
      }
    }
  };

  render() {
    let image = this.state.image;
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Upload your whiteboard code.</Text>
        {image && !this.state.hide && (
          <Image
            source={{ uri: image }}
            style={{ width: 150, height: 100, margin: 10 }}
          />
        )}
        {!this.state.hide && (
          <View style={styles.subcontainer}>
            <Button onPress={() => this._takePicture()}>Camera</Button>
            <Button onPress={() => this._pickImage()}>Gallery</Button>
            <Button
              disabled={this.state.language === ""}
              onPress={() => this.getOutput()}
            >
              {this.state.restart ? "Re-run" : "Run"}
            </Button>
          </View>
        )}
        {!this.state.hide && (
          <View style={styles.subcontainer}>
            <CheckBox
              title="JS"
              checked={this.state.language == "Javascript"}
              onPress={() => this.setState({ language: "Javascript" })}
            />
            <CheckBox
              title="C"
              checked={this.state.language == "C"}
              onPress={() => this.setState({ language: "C" })}
            />
            <CheckBox
              title="C++"
              checked={this.state.language == "C++"}
              onPress={() => this.setState({ language: "C++" })}
            />
          </View>
        )}
        {!this.state.hide && (
          <View style={styles.subcontainer}>
            <CheckBox
              title="Python (Beta) 😢"
              checked={this.state.language == "Python"}
              onPress={() => this.setState({ language: "Python" })}
            />
          </View>
        )}

        <View
          style={{
            width: 300,
            margin: 20,
            height: 200,
            flexDirection: "column"
          }}
        >
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
          <Text style={styles.paragraph}> 📜 Text Detection</Text>
          {this.state.compiling ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView
              contentContainerStyle={{
                height: 700
              }}
            >
              <TextInput
                keyboardType="default"
                returnKeyType="done"
                multiline={true}
                blurOnSubmit={true}
                onBlur={() => {
                  this.setState({ hide: false });
                }}
                onFocus={() => {
                  this.setState({ hide: true });
                }}
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  this.setState({ hide: false });
                }}
                multiline
                numberOfLines={4}
                onChangeText={annotation => {
                  this.setState({ annotation });
                }}
                value={this.state.annotation}
              />
            </ScrollView>
          )}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
          <Text style={styles.paragraph}> 📖 Output Here</Text>
          {this.state.compiling ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView
              contentContainerStyle={{
                height: 700
                //borderColor: "grey",
                //borderWidth: 2
              }}
            >
              <Text style={{ width: "100%" }}> {this.state.myoutput} </Text>
            </ScrollView>
          )}
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
        </View>
      </View>
    );
  }
}

const Button = ({ onPress, children, disabled }) => (
  <TouchableOpacity disabled={disabled} style={styles.button} onPress={onPress}>
    <Text style={{ ...styles.text, color: disabled ? "white" : "black" }}>
      {children}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    // borderWidth:1,
    // borderColor:'black',
    alignItems: "center",
    justifyContent: "center",
    margin: 10
  },
  subcontainer: {
    //borderWidth:3,
    //borderColor:'black',
    flexDirection: "row"
  },
  text: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold"
  },
  button: {
    width: 100,
    padding: 13,
    margin: 5,
    backgroundColor: "#dddddd"
    //borderWidth:3,
    //borderColor:'black'
  },
  paragraph: {
    // borderWidth:1,
    // borderColor:'black',
    margin: 6,
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center"
  }
});
