import { Duration, intervalToDuration, isBefore } from "date-fns";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TimeSegment } from "../../components/TimeSegment";
import { theme } from "../../theme";
import { registerForPushNotificationsAsync } from "../../utils/notification";
import { getFromStorage, saveToStorage } from "../../utils/storage";

const frequency = 10 * 1000;
const countdownStorageKey = "countdown";

interface PersistedCountdownState {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
}

interface CountdownStatus {
  isOverdue: boolean;
  distance: Duration;
}

export default function CounterScreen() {
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
        title: "The thing is due!",
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

  return (
    <View style={[styles.container, status.isOverdue && styles.containerLate]}>
      {!status.isOverdue ? (
        <Text style={styles.heading}>Thing due in</Text>
      ) : (
        <Text style={[styles.heading, status.isOverdue && styles.textWhite]}>
          Thing overdue by
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
        <Text style={styles.buttonText}>I've done the thing!</Text>
      </TouchableOpacity>
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
});
