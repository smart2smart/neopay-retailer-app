import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import moment from "moment";

import texts from "@texts";
import colors from "@colors";
import { commonApi } from "@api";
import Indicator from "@utils/Indicator";
import TabButtons from "@commons/TabButton";
import SecondaryHeader from "@headers/SecondaryHeader";
import { AuthenticatedGetRequest } from "@authenticatedGetRequest";

import SurveyCard from "./SurveyCard";

const SurveyList = () => {
  const route = useRoute();
  const [isLoading, setLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [surveyArchiveList, setSurveyArchiveList] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [selectedTab, setSelectedTab] = useState("tab1");
  const [count, setCount] = useState(0);
  const focused = useIsFocused();

  useEffect(() => {
    getSurveys(false);
  }, [focused]);

  const getSurveys = (paginate: boolean) => {
    let url = "";
    if (paginate) {
      if (count === surveyList.length) {
        return;
      }
      url = next;
    } else {
      url = commonApi.getSurveysList.url + "?limit=10&offset=0";
    }
    const data = {
      method: commonApi.getSurveysList.method,
      url: url,
      header: commonApi.getSurveysList.header,
    };
    paginate ? setPageLoading(true) : setLoading(true);
    // // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      setLoading(false);
      setPageLoading(false);
      if (res.status === 200) {
        // setCount(res.data.count);
        // setNext(res.data.next);
        // setSurveyList(
        //   paginate ? [...surveyList, ...res.data.results] : res.data.results
        // );
        let pending = [];
        let archiveList = res.data.filter((item) => {
          if (new Date(item.end_date) < new Date()) {
            return true;
          } else {
            pending.push({ ...item, disable: true });
            return false;
          }
        });
        setSurveyList(pending);
        setSurveyArchiveList(archiveList);
      } else {
        Alert.alert("Error");
      }
    });
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
      <Indicator isLoading={isLoading} />
      <SecondaryHeader title={"Surveys"} />

      <TabButtons
        tabList={[
          { label: "Active", value: "tab1" },
          {
            label: `Archive`,
            value: "tab2",
          },
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === "tab1" && surveyList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center", color: colors.grey }}>
            No Pending List!
          </Text>
        </View>
      ) : selectedTab === "tab1" && surveyList.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center", color: colors.grey }}>
            No Archive List!
          </Text>
        </View>
      ) : null}
      {!isLoading ? (
        <View style={styles.container}>
          <FlatList
            data={selectedTab === "tab1" ? surveyList : surveyArchiveList}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SurveyCard {...item} />}
            keyExtractor={(item) => item.id + "," + item.salesman}
            ItemSeparatorComponent={() => <View style={{ margin: 10 }}></View>}
          />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ alignSelf: "center", color: colors.grey }}>
            Please wait..
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default SurveyList;
