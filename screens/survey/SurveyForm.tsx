import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import texts from "@texts";

import Indicator from "@utils/Indicator";
import SecondaryHeader from "@headers/SecondaryHeader";
import commonStyles from "@commonStyles";
import NewVisitPopup from "./ModalPopup";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { BorderButtonBigRed, BorderButtonSmallRed } from "@Buttons";
import colors from "@colors";
import Checkbox from "expo-checkbox";
import moment from "moment";
import InputBox from "./InputBox";
import { useSelector } from "react-redux";
import {
  AuthenticatedPostRequest,
  UploadFileRequestAxios,
} from "@authenticatedPostRequest";
import RangeSlider, { Slider } from "react-native-range-slider-expo";
import DropDownInput from "@commons/DropDownInput";
import RatingInput from "@commons/RatingInput";

const SurveyForm = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [questionList, setQuestionList] = useState([]);
  const [ResponseList, setResponseList] = useState({});
  const [question, setQuestion] = useState({});
  const [response, setResponse] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [number, setNumber] = useState(0);
  const [range, setRange] = useState(0);
  const [image, setImage] = useState(null);
  const [showUploadOption, setShowUploadOption] = useState(false);
  const [showDropDownOption, setShowDropDownOption] = useState(false);
  const [isNewImage, setIsNewImage] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const [selectOption, setSelectedOption] = useState("");
  const [Answer, setAnswer] = useState("");
  const [selectOptionCheckbox, setSelectOptionCheckbox] = useState([]);

  const retailerData = useSelector((state: any) => state.retailerDetails);
  const [DateShow, setDateShow] = useState(false);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getSurveyQuestion();
    getSurveyResponse();
  }, []);

  const captureImage = async () => {
    try {
      const { status: status2 } =
        await ImagePicker.requestCameraPermissionsAsync();
      if (status2 === "granted") {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 0.1,
          aspect: [4, 3],
          base64: true,
          allowsMultipleSelection: false,
        });

        if (result && !result.cancelled && result.uri) {
          setResponseList({
            ...ResponseList,
            [question.id]: {
              data: result.uri,
            },
          });
        }
      } else {
        Alert.alert(
          "Sorry",
          "You cannot cake picture, Please allow camera permission"
        );
      }
    } catch (err) {}
  };

  const pickImage = async () => {
    const { status: status1 } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status1 === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });
      if (!result.cancelled) {
        setResponseList({
          ...ResponseList,
          [question.id]: {
            data: result.uri,
          },
        });
      }
    } else {
      Alert.alert(
        "Sorry",
        "You cannot upload picture, Please allow gallery permission"
      );
    }
  };

  const getSurveyQuestion = () => {
    const data = {
      method: commonApi.getSurveysList.method,
      url: commonApi.getSurveysList.url + route.params.survey,
      header: commonApi.getSurveysList.header,
    };
    setLoading(true);
    // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        setQuestionList(res.data.questions.filter((item) => item.enabled));
        setQuestion(res.data.questions[0]);
      } else {
        Alert.alert("Error");
      }
    });
  };

  const getSurveyResponse = () => {
    if (route.params.id) {
      const data = {
        method: commonApi.getSurveysResponse.method,
        url:
          commonApi.getSurveysResponse.url + "?response_id=" + route.params.id,
        header: commonApi.getSurveysResponse.header,
      };
      setLoading(true);
      // @ts-ignore
      AuthenticatedGetRequest(data).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          let response = {};
          res.data.forEach((item) => {
            response[item.question] = item.file
              ? { id: item.id, data: item.file }
              : { id: item.id, data: item.response };
          });
          setResponseList(response);
        } else {
          Alert.alert("Error");
        }
      });
    }
  };

  const submitAnswer = (text: any) => {
    if (text) {
      const data = {
        method: ResponseList[question.id]?.id
          ? "PATCH"
          : commonApi.sendSurveysResponse.method,
        url: ResponseList[question.id]?.id
          ? commonApi.sendSurveysResponse.url +
            ResponseList[question.id]?.id +
            "/"
          : commonApi.sendSurveysResponse.url,
        header: commonApi.sendSurveysResponse.header,
        data: {
          user: retailerData.user,
          survey: question.survey,
          question: question.id,
          response: text,
        },
      };
      setLoading(true);
      // @ts-ignore
      AuthenticatedPostRequest(data).then((res) => {
        setLoading(false);
        if (res.status === 200) {
          if (!route.params.id) {
            navigation.setParams({ ...route.params, id: res.data.id });
          }
          if (!ResponseList[question.id]?.id) {
            setResponseList({
              ...ResponseList,
              [question.id]: {
                ...ResponseList[question.id],
                id: res.data.id,
              },
            });
          }

          if (selectedQuestion + 1 < questionList.length) {
            setQuestion(questionList[selectedQuestion + 1]);
            setSelectedQuestion(selectedQuestion + 1);
          } else if (selectedQuestion + 1 === questionList.length) {
            submitSurvey();
          }
        } else {
          Alert.alert("Error");
        }
      });
    } else {
      if (selectedQuestion + 1 < questionList.length) {
        setQuestion(questionList[selectedQuestion + 1]);
        setSelectedQuestion(selectedQuestion + 1);
      } else if (selectedQuestion + 1 === questionList.length) {
        submitSurvey();
      }
    }
  };

  const submitSurvey = (text: any) => {
    const data = {
      method: commonApi.submitSurveys.method,
      url: commonApi.submitSurveys.url,
      header: commonApi.submitSurveys.header,

      data: {
        survey: question.survey,
        user: retailerData.user,
        status: "complete",
      },
    };
    setLoading(true);
    // @ts-ignore
    AuthenticatedPostRequest(data).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        navigation.goBack();
      } else {
        Alert.alert("Error");
      }
    });
  };

  const submitFileAnswer = (image) => {
    const form_data = new FormData();

    form_data.append("user", retailerData.user);
    form_data.append("survey", question.survey);
    form_data.append("question", question.id);

    let filename = image.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    form_data.append("file", {
      uri: image,
      type: type,
      name: filename,
    });

    const data = {
      method: commonApi.sendSurveysResponse.method,
      url: commonApi.sendSurveysResponse.url,
      header: {},
      data: form_data,
    };
    setLoading(true);
    // @ts-ignore
    UploadFileRequestAxios(data).then((res) => {
      setLoading(false);
      if (res.status === 200) {
        if (!ResponseList[question.id]?.id) {
          setResponseList({
            ...ResponseList,
            [question.id]: {
              ...ResponseList[question.id],
              id: res.data.id,
            },
          });
        }
        if (selectedQuestion + 1 < questionList.length) {
          setQuestion(questionList[selectedQuestion + 1]);
          setSelectedQuestion(selectedQuestion + 1);
        } else if (selectedQuestion + 1 == questionList.length) {
          submitSurvey();
        }
      } else {
        Alert.alert("Error");
      }
    });
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <SecondaryHeader title="Survey" />
      <Indicator isLoading={isLoading} />
      <View style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 20 }}>
        <View style={commonStyles.rowSpaceBetween}>
          <Text style={[texts.redTextBold16, { width: "90%" }]}>
            {route.params.title}
          </Text>
          <Text style={texts.greyTextBold12}>
            {moment(route.params.create_at).format("DD-MMM")}
          </Text>
        </View>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={texts.greyTextBold14}>
              Please Wait, Survey is loading
            </Text>
          </View>
        ) : (
          <View style={{ marginTop: 50, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[texts.redTextBold16, { marginRight: 20 }]}>
                {question.sequence}
              </Text>
              <Text style={[texts.greyTextBold18, { lineHeight: 22 }]}>
                {question.title}
                {question.is_mandatory ? "*" : ""}
              </Text>
            </View>

            {question.type === "file_upload" ? (
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 30,
                  overflow: "hidden",
                }}
              >
                {ResponseList[question.id]?.data ? (
                  <TouchableOpacity
                    style={style.imageContainer}
                    onPress={() => setShowUploadOption(true)}
                  >
                    <Image
                      source={{ uri: ResponseList[question.id]?.data }}
                      style={[{ width: 100, height: 100 }, style.iconDiv]}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={style.imageContainer}
                    onPress={() => setShowUploadOption(true)}
                  >
                    <View style={style.textDiv}>
                      <View style={style.iconDiv}>
                        <MaterialIcons name="add" size={22} />
                      </View>
                    </View>
                    <Text style={[texts.greyTextBold16, { margin: 10 }]}>
                      Attach File
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : question.type === "rating" ? (
              <RatingInput
                style={{ marginTop: 40 }}
                rating={ResponseList[question.id]?.data || 0}
                setRating={(item) => {
                  setResponseList({
                    ...ResponseList,
                    [question.id]: {
                      ...ResponseList[question.id],
                      data: item,
                    },
                  });
                }}
              />
            ) : question.type === "dropdown" ? (
              <DropDownInput
                value={ResponseList[question.id]?.data}
                setValue={(item) => {
                  setResponseList({
                    ...ResponseList,
                    [question.id]: {
                      ...ResponseList[question.id],
                      data: item.label,
                    },
                  });
                }}
                options={question.options.split(",").map((item) => {
                  return {
                    label: item,
                  };
                })}
              />
            ) : question.type === "radio" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                {question.options.split(",").map((item) => {
                  return (
                    <TouchableOpacity
                      style={[commonStyles.row, { marginBottom: 20 }]}
                      onPress={() => {
                        setResponseList({
                          ...ResponseList,
                          [question.id]: {
                            ...ResponseList[question.id],
                            data: item,
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor:
                            item === ResponseList[question.id]?.data
                              ? colors.red
                              : "#707070",
                        }}
                      >
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 10,
                            backgroundColor:
                              item === ResponseList[question.id]?.data
                                ? colors.red
                                : colors.white,
                          }}
                        />
                      </View>
                      <Text style={[texts.greyTextBold16, { marginLeft: 10 }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : question.type === "checkbox" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                {question.options.split(",").map((item) => {
                  return (
                    <TouchableOpacity
                      style={[commonStyles.row, { marginBottom: 20 }]}
                      onPress={() => {
                        let selectOptionSet = new Set(
                          ResponseList[question.id]?.data?.split(",")
                        );

                        if (selectOptionSet.has(item))
                          selectOptionSet.delete(item);
                        else selectOptionSet.add(item);

                        setResponseList({
                          ...ResponseList,
                          [question.id]: {
                            ...ResponseList[question.id],
                            data: selectOptionSet.join(","),
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 1,
                          borderWidth: 2,
                          justifyContent: "center",
                          alignItems: "center",
                          borderColor: ResponseList[question.id]?.data
                            ?.split(",")
                            .includes(item)
                            ? colors.red
                            : "#707070",
                          backgroundColor: ResponseList[question.id]?.data
                            ?.split(",")
                            .includes(item)
                            ? colors.red
                            : colors.white,
                        }}
                      >
                        <MaterialIcons
                          name="check"
                          size={16}
                          color={colors.white}
                        />
                      </View>
                      <Text style={[texts.greyTextBold16, { marginLeft: 10 }]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : question.type === "date" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                <View
                  style={{
                    width: 250,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setDateShow(true);
                    }}
                    style={[
                      {
                        flexDirection: "column",
                        borderWidth: 1,
                        padding: 10,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    <View
                      style={{
                        backgroundColor: "#e0e0e0",
                        padding: 5,
                        margin: 1,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={[
                          texts.darkGreyTextBold20,
                          { textAlign: "center" },
                        ]}
                      >
                        {date
                          ? moment(date).format("DD")
                          : ResponseList[question.id]?.data
                          ? moment(ResponseList[question.id]?.data).format("DD")
                          : "Date"}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#e0e0e0",
                        margin: 1,
                        padding: 10,
                        borderRadius: 5,
                      }}
                    >
                      <Text
                        style={[
                          texts.primaryTextBold14,
                          {
                            textAlign: "center",
                          },
                        ]}
                      >
                        {date
                          ? moment(date).format("MMM-yyyy")
                          : ResponseList[question.id]?.data
                          ? moment(ResponseList[question.id]?.data).format(
                              "MMM-yyyy"
                            )
                          : "Date"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : question.type === "number" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                <TextInput
                  value={ResponseList[question.id]?.data}
                  maxLength={10}
                  keyboardType={"numeric"}
                  onChangeText={(num) => {
                    setResponseList({
                      ...ResponseList,
                      [question.id]: {
                        ...ResponseList[question.id],
                        data: num,
                      },
                    });
                  }}
                  style={style.textInput}
                ></TextInput>
              </View>
            ) : question.type === "range" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  valueOnChange={(value) => {
                    setResponseList({
                      ...ResponseList,
                      [question.id]: {
                        ...ResponseList[question.id],
                        data: value,
                      },
                    });
                  }}
                  initialValue={ResponseList[question.id]?.data}
                  knobColor={colors.orange}
                  valueLabelsBackgroundColor="black"
                  inRangeBarColor={colors.red}
                  outOfRangeBarColor={colors.red}
                />
                <Text style={texts.blackTextBold16}>
                  Value: {ResponseList[question.id]?.data}
                </Text>
              </View>
            ) : question.type === "text" ? (
              <View style={[{ marginTop: 40, padding: 10 }]}>
                <InputBox
                  title={"Answer:"}
                  placeholder={"Enter Answer here"}
                  value={ResponseList[question.id]?.data}
                  setter={(data) => {
                    setResponseList({
                      ...ResponseList,
                      [question.id]: {
                        ...ResponseList[question.id],
                        data: data,
                      },
                    });
                  }}
                />
              </View>
            ) : null}

            <KeyboardAvoidingView
              style={{
                marginTop: "auto",
              }}
            >
              {isMandatory ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: 20,
                  }}
                >
                  <Text style={texts.redTextBold14}>
                    This Survey's question is mandatory!
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginBottom: 20,
                }}
              >
                {questionList.map((item, index) => (
                  <View
                    style={{
                      backgroundColor:
                        index === selectedQuestion ? colors.black : "#aaa",
                      height: 8,
                      width: 8,
                      margin: 4,
                      borderRadius: 5,
                    }}
                  />
                ))}
              </View>
              <View
                style={[
                  commonStyles.rowSpaceBetween,
                  { width: "100%", marginBottom: 20 },
                ]}
              >
                <BorderButtonSmallRed
                  textStyle={texts.redTextBold14}
                  style={[commonStyles.rowCenter, { width: 100, height: 50 }]}
                  text={selectedQuestion > 0 ? "Previous" : "Exit"}
                  ctaFunction={() => {
                    if (selectedQuestion > 0) {
                      setQuestion(questionList[selectedQuestion - 1]);
                      setSelectedQuestion(selectedQuestion - 1);
                    } else {
                      navigation.goBack();
                    }
                  }}
                />

                <BorderButtonSmallRed
                  textStyle={texts.redTextBold14}
                  text={
                    selectedQuestion + 1 < questionList.length
                      ? "Next"
                      : "Submit"
                  }
                  ctaFunction={() => {
                    if (
                      question.is_mandatory &&
                      !ResponseList[question.id]?.data
                    ) {
                      setIsMandatory(true);
                      return;
                    }

                    setIsMandatory(false);
                    if (question.type !== "file_upload") {
                      submitAnswer(ResponseList[question.id]?.data);
                    } else if (question.type === "file_upload") {
                      submitFileAnswer(ResponseList[question.id]?.data);
                    }
                  }}
                  style={[commonStyles.rowCenter, { width: 100, height: 50 }]}
                />
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
      {showUploadOption ? (
        <NewVisitPopup
          visible={showUploadOption}
          title="Upload File"
          onClose={() => setShowUploadOption(false)}
          VisitOptions={[
            {
              label: "Upload from Device",
              onclick: () => {
                pickImage();
                setShowUploadOption(false);
              },
            },
            {
              label: "Camera",
              onclick: () => {
                captureImage();
                setShowUploadOption(false);
              },
            },
          ]}
        />
      ) : null}

      {DateShow && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date || new Date()}
          mode={"date"}
          display="default"
          onChange={(event, date) => {
            setDateShow(false);
            setDate(date);
            setResponseList({
              ...ResponseList,
              [question.id]: {
                ...ResponseList[question.id],
                data: moment(date).format("DD-MM-YYYY"),
              },
            });
          }}
        />
      )}
    </View>
  );
};

export default SurveyForm;

const style = StyleSheet.create({
  imageContainer: {
    position: "relative",
    borderRadius: 5,
    borderColor: "#888",
    borderWidth: 1,
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  iconDiv: {
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 5,
  },
  textDiv: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    height: 48,
    fontFamily: "GothamMedium",
    paddingLeft: 10,
  },
});
