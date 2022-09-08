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

import Indicator from "@utils/Indicator";
import SecondaryHeader from "@headers/SecondaryHeader";
import { commonApi } from "@api";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";
import moment from "moment";
import { useRoute } from "@react-navigation/native";
import commonStyles from "@commonStyles";
import texts from "@texts";

const ViewSurvey = () => {
  const route = useRoute();
  const [isLoading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [ResponseList, setResponseList] = useState({});

  useEffect(() => {
    getSurveyQuestion();
    getSurveyResponse();
  }, []);

  const getSurveyQuestion = (paginate: boolean) => {
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
      } else {
        Alert.alert("Error");
      }
    });
  };

  const getSurveyResponse = (paginate: boolean) => {
    const data = {
      method: commonApi.getSurveysResponse.method,
      url: commonApi.getSurveysResponse.url + "?response_id=" + route.params.id,
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
            ? { id: item.id, data: item.file, file: true }
            : { id: item.id, data: item.response };
        });
        setResponseList(response);
      } else {
        Alert.alert("Error");
      }
    });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      <SecondaryHeader title="Survey" />
      <Indicator isLoading={isLoading} />
      <View style={{ flex: 1, paddingVertical: 20 }}>
        <View
          style={[
            commonStyles.rowSpaceBetween,
            { paddingHorizontal: 30, alignItems: "flex-start" },
          ]}
        >
          <Text style={[texts.redTextBold16, { width: "80%" }]}>
            {route.params.title}
          </Text>
          <View>
            <Text style={texts.greyTextBold12}>{"Submitted on"}</Text>
            <Text style={texts.greyTextBold12}>
              {moment(route.params.updated_at).format("DD-MMM")}
            </Text>
          </View>
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: 30,
            }}
          >
            {questionList.map((question) => (
              <View
                style={{
                  marginTop: 10,
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  padding: 10,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <Text
                    style={[
                      texts.redTextBold16,
                      { width: "10%", lineHeight: 18 },
                    ]}
                  >
                    {question.sequence}
                  </Text>
                  <Text
                    style={[
                      texts.greyTextBold14,
                      { lineHeight: 18, width: "92%" },
                    ]}
                  >
                    {question.title}
                    {question.is_mandatory ? "*" : ""}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={[
                      texts.greyTextBold16,
                      { marginRight: 20, lineHeight: 18 },
                    ]}
                  >
                    {"A"}
                  </Text>
                  {ResponseList[question.id]?.file ? (
                    <Image
                      source={{ uri: ResponseList[question.id]?.data }}
                      style={[{ width: 100, height: 100 }]}
                    />
                  ) : (
                    <Text style={texts.blackTextBold14}>
                      {ResponseList[question.id]?.data || "-"}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default ViewSurvey;
