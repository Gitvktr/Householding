import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import { mockedChores } from '../data/data';
import { RootStackParamList } from '../navigators/RootStackNavigator';

type ChoreProps = {
  route: RouteProp<RootStackParamList, 'ChoreDetails'>;
  navigation: NavigationProp<RootStackParamList>;
};

export default function ChoreDetailsScreen({ route, navigation }: ChoreProps) {
  const chore = mockedChores.find((item) => item.id === route.params.id);

  useLayoutEffect(() => {
    if (chore) {
      navigation.setOptions({
        title: chore.title,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
      });
    }
  }, [navigation, chore]);

  if (!chore) {
    return (
      <View style={styles.container}>
        <Text style={styles.descriptionText}>Chore not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={[styles.basicCard, styles.mt10, styles.mb25]}>
          <Card.Content>
            <Text style={styles.descriptionText}>{chore.description}</Text>
          </Card.Content>
        </Card>
        <View>
          <IconButton
            icon="check"
            size={40}
            iconColor="#4CBC64"
            style={styles.checkButton}
            onPress={() => console.log('Sysslan är gjord')}
          />
        </View>
        <Card style={[styles.basicCard, styles.mt25]}>
          <Card.Content style={styles.flexRowContent}>
            <Text style={styles.boldText}>Återkommer:</Text>
            <View style={styles.flexRowContent}>
              <Text style={styles.recurDayText}>var</Text>
              <View style={[styles.circle, styles.mh5, styles.red]}>
                <Text style={styles.redCircleText}>{chore.interval}</Text>
              </View>
              <Text style={styles.recurDayText}>dag</Text>
            </View>
          </Card.Content>
        </Card>
        <Card style={[styles.basicCard, styles.mt25]}>
          <Card.Content style={styles.flexRowContent}>
            <View>
              <Text style={styles.boldText}>Värde:</Text>
              <Text style={styles.greyText}>
                Hur energikrävande är sysslan?
              </Text>
            </View>
            <View style={[styles.circle, styles.lightGray]}>
              <Text style={styles.grayCircleText}>{chore.energyWeight}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          icon="close-circle-outline"
          textColor="black"
          buttonColor="#fff"
          labelStyle={styles.closeButtonText}
          style={{
            width: '100%',
            borderRadius: 0,
            justifyContent: 'center',
          }}
          onPress={() => navigation.navigate('Chores')}
        >
          Stäng
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  flexRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basicCard: {
    backgroundColor: '#fff',
    maxWidth: '97%',
    minWidth: '97%',
  },
  mt10: {
    marginTop: 10,
  },
  mt25: {
    marginTop: 25,
  },
  mb25: {
    marginBottom: 25,
  },
  mh5: {
    marginHorizontal: 5,
  },
  checkButton: {
    backgroundColor: '#FFFBFB',
    borderRadius: 20,
    width: 60,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 24,
  },
  boldText: {
    fontSize: 20,
    fontWeight: 700,
  },
  recurDayText: {
    fontSize: 20,
  },
  circle: {
    borderRadius: 12.5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  red: {
    backgroundColor: '#D96163',
  },
  lightGray: {
    backgroundColor: '#EAEAEA',
  },
  redCircleText: {
    color: '#fff',
    fontSize: 17,
  },
  grayCircleText: {
    fontSize: 17,
  },
  greyText: {
    color: '#828282',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 55,
  },
  closeButtonText: {
    fontSize: 20,
    padding: 2,
    justifyContent: 'center',
  },
});
