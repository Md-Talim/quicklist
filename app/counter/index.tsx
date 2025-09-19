import { Duration, intervalToDuration, isBefore } from "date-fns";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { TimeSegment } from "../../components/TimeSegment";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/notification";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// 2 weeks
const frequency = 14 * 24 * 60 * 60 * 1000;
export const countdownStorageKey = "countdown";

export interface PersistedCountdownState {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
}

interface CountdownStatus {
  isOverdue: boolean;
  distance: Duration;
}

export default function CounterScreen() {
  const confettiRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    };
    init();
  }, []);

  const lastCompletedAt = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedAt
        ? lastCompletedAt + frequency
        : Date.now();
      if (lastCompletedAt) {
        setIsLoading(false);
      }
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedAt]);

  const scheduleNotification = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    confettiRef.current?.start();
    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();

    if (result !== "granted") {
      Alert.alert(
        "Unable to schedule notification",
        "Enable the notifications permission for Expo Go in settings"
      );
      return;
    }

    pushNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Car wash is due!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: frequency / 1000,
      },
    });

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState
        ? [Date.now(), ...countdownState.completedAtTimestamps]
        : [Date.now()],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={styles.acitivityIndicatorContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, status.isOverdue && styles.containerLate]}>
      {!status.isOverdue ? (
        <Text style={styles.heading}>Car wash due in</Text>
      ) : (
        <Text style={[styles.heading, status.isOverdue && styles.textWhite]}>
          Car wash overdue by
        </Text>
      )}

      <View style={styles.row}>
        <TimeSegment
          unit="Days"
          number={status.distance?.days ?? 0}
          textStyle={status.isOverdue ? styles.textWhite : undefined}
        />
        <TimeSegment
          unit="Hours"
          number={status.distance?.hours ?? 0}
          textStyle={status.isOverdue ? styles.textWhite : undefined}
        />
        <TimeSegment
          unit="Minutes"
          number={status.distance?.minutes ?? 0}
          textStyle={status.isOverdue ? styles.textWhite : undefined}
        />
        <TimeSegment
          unit="Seconds"
          number={status.distance?.seconds ?? 0}
          textStyle={status.isOverdue ? styles.textWhite : undefined}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>I've washed the car!</Text>
      </TouchableOpacity>

      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: Dimensions.get("window").width / 2, y: 0 }}
        autoStart={false}
        fadeOut={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  button: {
    backgroundColor: theme.colorBlack,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingBlock: 8,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colorBlack,
  },
  textWhite: {
    color: theme.colorWhite,
  },
  row: {
    flexDirection: "row",
    marginBlock: 24,
  },
  acitivityIndicatorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
});
