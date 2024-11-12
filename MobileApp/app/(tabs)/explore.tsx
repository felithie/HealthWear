import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Text, View, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <View>
      <Text style={styles.Headline}>Was ist ein gesunder Rücken?</Text>
      <Text>
        Ein gesunder Rücken ist ein Rücken, der nicht schmerzt. Rückenschmerzen
        sind eine der häufigsten Ursachen für Arbeitsunfähigkeit. Sie können
        durch verschiedene Faktoren verursacht werden, darunter schlechte
        Körperhaltung, schwache Muskeln, Übergewicht und Stress. Es gibt viele
        Dinge, die Sie tun können, um Ihren Rücken gesund zu halten, darunter
        regelmäßige Bewegung, gesunde Ernährung und Stressabbau. </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  Headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  }
});
