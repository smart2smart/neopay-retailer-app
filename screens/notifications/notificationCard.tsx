import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import moment from "moment";

import texts from "../../styles/texts";
import { AuthenticatedPostRequest } from "../../api/authenticatedPostRequest";
import { commonApi } from "../../api/api";
import { BlueButtonSmall, BorderButtonSmallBlue, SolidButtonBlue, SolidButtonSmallRed } from "../../buttons/Buttons";

type NotificationCardProps = {
  title: string;
  time: string;
  body: string;
  uuid: string;
};

const NotificationCard = (props) => {
  const updateNotifications = (data) => {
    const dataToSend = {
      method: commonApi.updateNotifications.method,
      url: commonApi.updateNotifications.url,
      header: commonApi.updateNotifications.header,
      data: data,
    };
    AuthenticatedPostRequest(dataToSend).then((res) => {
      if (res.status == 200) {
        props.reload();
      } else {
      }
    });
  };

  return (
    <View
      style={[
        styles.mainContainer,
        props.status !== "clicked"
          ? {
              borderLeftWidth: 4,
              borderLeftColor: "#BD6987",
              backgroundColor: "rgba(189, 105, 135, 0.06)",
            }
          : {
              borderLeftWidth: 4,
              borderLeftColor: "#aaa",
            },
      ]}
    >
      <View style={{ width: "100%" }}>
        <View style={[styles.rowSpaceBtw]}>
          <View>
            <Text style={[texts.blackTextBold14, { marginVertical: 4 }]}>
              {props.title}
            </Text>
          </View>
          <View>
            <Text style={[texts.greyNormal12, { marginVertical: 4 }]}>
              {moment(props.time).fromNow()}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={[texts.blackText12, { fontSize: 13, marginVertical: 4 }]}
          >
            {props.body}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <BorderButtonSmallBlue
            text="Dismiss"
            style={{ marginRight: 10, borderWidth: 0 }}
            ctaFunction={() => {
              if (props.uuid)
                updateNotifications({
                  uuid: props.uuid,
                  status: "dismissed",
                  app_name: "partner",
                });
            }}
          />
          <BlueButtonSmall
            text="Track Order"
            ctaFunction={() => {
              if (props.status !== "clicked")
                if (props.uuid)
                  updateNotifications({
                    uuid: props.uuid,
                    status: "clicked",
                    app_name: "partner",
                  });
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
  },
  rowSpaceBtw: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NotificationCard;
