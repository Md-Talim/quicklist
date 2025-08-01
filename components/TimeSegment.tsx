import { StyleSheet, Text, TextStyle, View } from "react-native";

interface TimeSegmentProps {
  number: number;
  unit: string;
  textStyle?: TextStyle;
}

export function TimeSegment({ number, unit, textStyle }: TimeSegmentProps) {
  return (
    <View style={styles.segmentContainer}>
      <Text style={[styles.number, textStyle]}>{number}</Text>
      <Text style={textStyle}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentContainer: {
    padding: 12,
    margin: 4,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 24,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
});
