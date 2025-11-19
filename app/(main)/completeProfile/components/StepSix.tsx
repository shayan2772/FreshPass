import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector, useTheme } from "@/src/hooks/hooks";
import { Theme } from "@/src/theme/colors";
import { fontSize, fonts } from "@/src/theme/fonts";
import {
  moderateHeightScale,
  moderateWidthScale,
} from "@/src/theme/dimensions";
import FloatingInput from "@/src/components/floatingInput";
import {
  addStaffInvitation,
  setStaffInvitationEmail,
} from "@/src/state/slices/completeProfileSlice";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: moderateHeightScale(24),
      paddingHorizontal: moderateWidthScale(20),
    },
    titleSec: {
      marginTop: moderateHeightScale(8),
      gap: 5,
    },
    title: {
      fontSize: fontSize.size24,
      fontFamily: fonts.fontBold,
      color: theme.darkGreen,
    },
    subtitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    inputSection: {},
    inputRowContainer: {
      flexDirection: "row",
      gap: moderateWidthScale(12),
    },
    inviteButton: {
      backgroundColor: theme.orangeBrown,
      borderRadius: moderateWidthScale(8),
      paddingHorizontal: moderateWidthScale(17),
      // paddingVertical: moderateHeightScale(8),
      alignItems: "center",
      justifyContent: "center",
    },
    inviteButtonText: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    invitationsSection: {
      gap: moderateHeightScale(12),
    },
    invitationsTitle: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
      textTransform: "lowercase",
      opacity: 0.7,
    },
    invitationList: {
      gap: 0,
    },
    invitationItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: moderateWidthScale(12),
      paddingVertical: moderateHeightScale(12),
    },
    avatarIcon: {
      width: moderateWidthScale(24),
      height: moderateWidthScale(24),
      borderRadius: moderateHeightScale(24 / 2),
      borderWidth:1,
      borderColor: theme.lightGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    invitationContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    invitationEmailContainer: {
      flex: 1,
      gap: moderateHeightScale(2),
    },
    invitationEmail: {
      fontSize: fontSize.size14,
      fontFamily: fonts.fontMedium,
      color: theme.darkGreen,
    },
    invitationStatus: {
      fontSize: fontSize.size11,
      fontFamily: fonts.fontRegular,
      color: theme.lightGreen,
    },
    divider: {
      height: 1.2,
      backgroundColor: theme.borderLight,
    },
  });

export default function StepSix() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors as Theme), [colors]);
  const theme = colors as Theme;
  const { staffInvitationEmail, staffInvitations } = useAppSelector(
    (state) => state.completeProfile
  );

  const handleClearEmail = () => {
    dispatch(setStaffInvitationEmail(""));
  };

  const handleInvite = () => {
    if (staffInvitationEmail.trim()) {
      dispatch(
        addStaffInvitation({
          email: staffInvitationEmail.trim(),
          status: "sent",
        })
      );
      dispatch(setStaffInvitationEmail(""));
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const canInvite =
    staffInvitationEmail.trim() &&
    (isValidEmail(staffInvitationEmail.trim()) ||
      isValidPhone(staffInvitationEmail.trim()));

  return (
    <View style={styles.container}>
      <View style={styles.titleSec}>
        <Text style={styles.title}>Add staff members</Text>
        <Text style={styles.subtitle}>
          Invite your staff by email. They&apos;ll be able to manage their
          schedule and appointments.
        </Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputRowContainer}>
          <FloatingInput
            label="Email or phone number"
            value={staffInvitationEmail}
            onChangeText={(value) => dispatch(setStaffInvitationEmail(value))}
            placeholder="Enter email or phone"
            placeholderTextColor={theme.lightGreen2}
            keyboardType="email-address"
            autoCapitalize="none"
            onClear={handleClearEmail}
            containerStyle={{ flex: 1 }}
          />
          <TouchableOpacity
            onPress={handleInvite}
            disabled={!canInvite}
            style={[
              styles.inviteButton,
              !canInvite && { opacity: 0.8 },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.inviteButtonText}>Invite</Text>
          </TouchableOpacity>
        </View>
      </View>

      {staffInvitations.length > 0 && (
        <View style={styles.invitationsSection}>
          <Text style={styles.invitationsTitle}>invitations send:</Text>
          <View style={styles.invitationList}>
            {staffInvitations.map((invitation, index) => {
              const showDivider = index < staffInvitations.length - 1;
              return (
                <React.Fragment key={index}>
                  <View style={styles.invitationItem}>
                    <View style={styles.avatarIcon}>
                      <Feather
                        name="user"
                        size={moderateWidthScale(16)}
                        color={theme.darkGreen}
                      />
                    </View>
                    <View style={styles.invitationContent}>
                      <View style={styles.invitationEmailContainer}>
                        <Text style={styles.invitationEmail}>{invitation.email}</Text>
                      </View>
                      <Text style={styles.invitationStatus}>
                        {invitation.status === "accepted"
                          ? "Invitation accepted"
                          : "Invitation sent"}
                      </Text>
                    </View>
                  </View>
                  {showDivider && <View style={styles.divider} />}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}
