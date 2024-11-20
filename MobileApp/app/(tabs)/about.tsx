import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Text, View, Platform, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function About() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer} edges={['top']}>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.Headline}>
            Bei BackTrack steht Ihre Gesundheit im Mittelpunkt.
          </Text>
          <Image source={require('./backpain.jpg')} style={styles.titleImage} />
          <View style={styles.textContainer}>
            {PostureContent()}
          </View>
          <View style={{height: 500}}/>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  contentContainer: {
    top: 20,
    height: "auto",
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textContainer: {
    top: 20,
    marginHorizontal: 30,
  },
  Headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
    textAlign: "center",
    marginHorizontal: 10,
    color: "#bd3a05",
  },
  titleImage: {
    height: "18%",
    width: "100%",
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 15,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginLeft: 10,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold', // Makes text bold
  },
});

const PostureContent = () => {
  return (
    <View>
      {/* Introduction */}
      <Text style={styles.body}>
        Die Idee entstand aus der Beobachtung, dass viele Menschen im Alltag unter schlechter Haltung leiden, sei es durch langes Sitzen im Büro, das Tragen schwerer Lasten oder einfach durch mangelndes Bewusstsein für die eigene Körperhaltung.
        Diese Herausforderungen führten zu der Vision, eine Lösung zu entwickeln, die sowohl präventiv als auch korrigierend wirkt.
      </Text>

      <Text style={styles.body}>
        Mit unserer innovativen App und dem dazugehörigen Oberteil haben wir ein System geschaffen, das Ihre Haltung kontinuierlich überwacht und Ihnen dabei hilft, bewusster und gesünder zu leben.
        Sobald Ihre Haltung von der idealen Position abweicht, erhalten Sie eine sanfte Benachrichtigung, um Korrekturen vorzunehmen.
        Unser Ziel ist es, langfristig Haltungsschäden vorzubeugen und Ihr Wohlbefinden zu steigern.
      </Text>

      {/* Application */}
      <Text style={styles.heading}>Die Anwendung ist einfach:</Text>
      <Text style={styles.body}>
        Tragen Sie das speziell entwickelte Oberteil und lassen Sie sich von der App durch den Tag begleiten.
        Dank unseres Habit Trackers können Sie Ihre Fortschritte verfolgen und langfristig ein gesünderes Leben führen.
      </Text>

      {/* Why Good Posture is Important */}
      <Text style={styles.heading}>Warum eine gute Haltung wichtig ist:</Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Verbesserung der Körperfunktionen:</Text> Eine gute Haltung optimiert die Funktion Ihrer Organe. Durch eine gerade Wirbelsäule wird der Druck auf Ihre inneren Organe minimiert, was eine bessere Atmung und Verdauung ermöglicht.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Vorbeugung von Schmerzen:</Text> Viele Rückenschmerzen resultieren aus schlechter Haltung. Durch bewusste Haltungskorrektur können Sie Verspannungen und chronische Schmerzen vorbeugen.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Erhöhung des Selbstbewusstseins:</Text> Eine aufrechte Haltung strahlt Selbstbewusstsein und Stärke aus. Sie fühlen sich nicht nur besser, sondern wirken auch auf andere positiv.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Steigerung der Produktivität:</Text> Eine gerade Sitzposition verbessert Ihre Konzentration und Energie. Ob im Büro oder beim Lernen – mit einer guten Haltung arbeiten Sie effizienter.
      </Text>

      {/* Tips */}
      <Text style={styles.heading}>Tipps für eine bessere Haltung im Alltag:</Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Achten Sie auf Ihre Sitzposition:</Text> Halten Sie Ihren Rücken gerade, die Schultern entspannt und die Füße flach auf dem Boden. Vermeiden Sie es, über längere Zeit in derselben Position zu verharren.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Regelmäßige Pausen:</Text> Stehen Sie mindestens einmal pro Stunde auf und bewegen Sie sich, um Ihre Muskeln zu lockern.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Richtige Einstellung der Arbeitsumgebung:</Text> Stellen Sie Ihren Schreibtisch und Monitor so ein, dass Sie nicht nach unten oder oben schauen müssen. Ihre Augen sollten auf gleicher Höhe mit dem oberen Bildschirmrand sein.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.bold}>Bewusstes Atmen:</Text> Atmen Sie tief in den Bauch. Dies hilft, Verspannungen im oberen Rücken und Nacken zu lösen.
      </Text>
    </View>
  );
};

