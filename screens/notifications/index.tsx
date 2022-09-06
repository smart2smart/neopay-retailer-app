import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import moment from "moment";

import SecondaryHeader from "../../headers/SecondaryHeader";
import Indicator from "../../utils/Indicator";
import colors from "../../assets/colors/colors";
import { commonApi } from "../../api/api";
import { AuthenticatedGetRequest } from "../../api/authenticatedGetRequest";
import NotificationCard from "./notificationCard";

const NotificationScreen = () => {
  const route = useRoute();
  const [isLoading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [NotificationList, setNotificationList] = useState([]);
  const [next, setNext] = useState(null);
  const [count, setCount] = useState(0);
  const salesman = useSelector((state: any) => state.salesman);

  useEffect(() => {
    getNotification(false);
  }, []);

  const getNotification = (paginate: boolean) => {
    let url = "";
    if (paginate) {
      if (count === NotificationList.length) {
        return;
      }
      url = next;
    } else {
      url =
        commonApi.getNotificationList.url +
        "?app_name=retailer&limit=10&offset=0";
    }
    const data = {
      method: commonApi.getNotificationList.method,
      url: url,
      header: commonApi.getNotificationList.header,
    };
    paginate ? setPageLoading(true) : setLoading(true);
    // // @ts-ignore
    AuthenticatedGetRequest(data).then((res) => {
      setLoading(false);
      setPageLoading(false);
      console.log(res.data)
      if (res.status === 200) {
        setCount(res.data.count);
        setNext(res.data.next);
        setNotificationList(
          paginate
            ? [...NotificationList, ...res.data.results]
            : res.data.results
        );
      } else {
        Alert.alert("Error");
      }
    });
  };

  const renderFooter = () => {
    return pageLoading ? (
      <View style={{ height: 50, marginTop: 20 }}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    ) : (
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.grey,
          marginTop: 20,
        }}
      ></View>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 12 }}>
      <Indicator isLoading={isLoading} />
      <SecondaryHeader title={"Notifications"} />

      {!isLoading ? (
        <View style={styles.container}>
          {NotificationList.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={{ alignSelf: "center", color: colors.grey }}>
                No Notification
              </Text>
            </View>
          ) : (
            <FlatList
              data={NotificationList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <NotificationCard
                  {...item}
                  title={item.title}
                  body={item.description}
                  time={item.created_at}
                  uuid={item.uuid}
                  reload={getNotification}
                />
              )}
              keyExtractor={(item) => item.id}
              ListFooterComponent={renderFooter}
              onEndReached={() => getNotification(true)}
              onEndReachedThreshold={0.1}
              ItemSeparatorComponent={() => (
                <View style={{ margin: 10 }}></View>
              )}
            />
          )}
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

export default NotificationScreen;
