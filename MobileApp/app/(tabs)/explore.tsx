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
      <Image
        source={require('Backpain-is-a-major-problem-for-adults.jpg')}
        style={styles.headerImage}
      />
      <Text style={styles.Headline}>Was ist ein gesunder Rücken?</Text>
      <Text>
        Ein gesunder Rücken ist ein Rücken, der nicht schmerzt. Rückenschmerzen
        sind eine der häufigsten Ursachen für Arbeitsunfähigkeit. Sie können
        durch verschiedene Faktoren verursacht werden, darunter schlechte
        Körperhaltung, schwache Muskeln, Übergewicht und Stress. Es gibt viele
        Dinge, die Sie tun können, um Ihren Rücken gesund zu halten, darunter
        regelmäßige Bewegung, gesunde Ernährung und Stressabbau. </Text>
    
    <Text style={styles.Headline}>Wie unser Produkt Ihnen hilft Ihren Rücken gesund zu halten.</Text>
    <Text>
      Unser Produkt ist ein Sportoberteil, welches Ihnen hilft,
      Ihre Körperhaltung zu verbessern und Ihre Rückenmuskulatur zu stärken. Das Oberteil ist mit Sensoren ausgestattet, die Ihre Körperhaltung überwachen
      und Ihnen Feedback geben, wenn Sie sich falsch bewegen oder über einen zu langen Zeitraum eine schlechte Haltung aufweisen. Unsere Technologie verwendet integrierte Dehnmessstreifen,
      welche uns aufschluss über Fehlhaltungen geben und mittel kompatiebler App diese Informationen an sie weitergibt. </Text>
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
