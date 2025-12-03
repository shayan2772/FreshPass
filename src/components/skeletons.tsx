import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import {
  heightScale,
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";

const createStyles = (theme: Theme) => StyleSheet.create({});

export const Skeleton = ({ screenType }: { screenType: "" | "StepOne" }) => {
  const { colors } = useTheme();
 
  const stepOneSkeleton = (
    <>
      <View
        style={{
          marginTop: moderateHeightScale(8),
          gap: moderateHeightScale(5),
          paddingHorizontal: moderateWidthScale(20),
        }}
      >
        <View
          style={{
            height: moderateHeightScale(28),
            width: "60%",
            borderRadius: moderateWidthScale(4),
          }}
        />
        <View
          style={{
            height: moderateHeightScale(18),
            width: "90%",
            borderRadius: moderateWidthScale(4),
            marginTop: moderateHeightScale(5),
          }}
        />
      </View>

      <View
        style={{
          marginTop: moderateHeightScale(5),
          marginHorizontal: moderateWidthScale(20),
          height: heightScale(18),
          borderRadius: moderateWidthScale(999),
        }}
      />

      <View
        style={{
          paddingVertical: moderateHeightScale(20),
          marginTop: moderateHeightScale(5),
        }}
      >
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: (colors as Theme).borderLight,
            position: "absolute",
            top: 0,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            rowGap: moderateHeightScale(12),
            paddingHorizontal: moderateWidthScale(20),
            gap: "5%",
          }}
        >
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={{
                width: "30%",
                height: heightScale(115),
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: heightScale(90),
                  borderRadius: moderateWidthScale(12),
                }}
              />
              <View
                style={{
                  marginTop: moderateHeightScale(5),
                  height: moderateHeightScale(16),
                  width: "80%",
                  alignSelf: "center",
                  borderRadius: moderateWidthScale(4),
                }}
              />
            </View>
          ))}
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: (colors as Theme).borderLight,
            marginTop: moderateHeightScale(20),
          }}
        />
      </View>

      <View
        style={{
          gap: moderateHeightScale(15),
          paddingHorizontal: moderateWidthScale(20),
          marginTop: moderateHeightScale(10),
        }}
      >
        <View
          style={{
            height: moderateHeightScale(20),
            width: "40%",
            borderRadius: moderateWidthScale(4),
          }}
        />
        <View
          style={{
            gap: moderateHeightScale(15),
            paddingHorizontal: moderateWidthScale(20),
          }}
        >
          {[...Array(8)].map((_, index) => (
            <View key={index} style={{ gap: moderateHeightScale(12) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: moderateHeightScale(20),
                    width: "70%",
                    borderRadius: moderateWidthScale(4),
                  }}
                />
                <View
                  style={{
                    height: moderateWidthScale(18),
                    width: moderateWidthScale(18),
                    borderRadius: moderateWidthScale(9),
                  }}
                />
              </View>
              {index < 7 && (
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: (colors as Theme).borderLight,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SkeletonPlaceholder backgroundColor="#E8DFB8" highlightColor="#DCCF9E">
      {screenType === "StepOne" && stepOneSkeleton}
    </SkeletonPlaceholder>
  );
};
