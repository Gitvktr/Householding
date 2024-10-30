import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Text, TextInput } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { avatarsMap } from '../data/data';
import { HouseholdMember } from '../data/types';
import { TopTabParamList } from '../navigators/TopTabNavigator';
import { setHouseholdName } from '../store/household/householdSlice';
import { selectMembersInCurrentHousehold } from '../store/householdmember/householdmemberSelectors';
import {
  setCurrentHouseholdMember,
  updateHouseholdMember,
} from '../store/householdmember/householdmemberSlice';
import {
  selectCurrentHousehold,
  selectCurrentHouseholdMember,
  selectCurrentUser,
} from '../store/sharedSelectors';
import { useAppDispatch, useAppSelector } from '../store/store';

type HouseholdProps = NativeStackScreenProps<TopTabParamList, 'Household'>;

export default function HouseholdScreen({ route }: HouseholdProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentHousehold = useAppSelector(selectCurrentHousehold);
  const membersInCurrentHousehold = useAppSelector(
    selectMembersInCurrentHousehold,
  );
  const currentHouseholdMember = useAppSelector(selectCurrentHouseholdMember);

  const isOwner = currentHouseholdMember?.owner ?? false;

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(setCurrentHouseholdMember(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const currentMember = membersInCurrentHousehold.find(
    (member) => member.userId === currentUser?.uid,
  );

  if (!currentMember) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Användaren kunde inte hittas.</Text>
      </View>
    );
  }

  const CurrentHousehold = () => {
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [newHouseholdName, setNewHouseholdName] = useState('');

    const currentHouseholdName = useAppSelector(selectCurrentHousehold)?.name;

    const handleSave = () => {
      dispatch(setHouseholdName(newHouseholdName));
      setIsEditing(false);
    };

    useEffect(() => {
      if (isEditing) {
        setNewHouseholdName(currentHouseholdName || '');
      }
    }, [isEditing, currentHouseholdName]);

    return (
      <View style={styles.householdContainer}>
        {isEditing ? (
          <TextInput
            mode="outlined"
            value={newHouseholdName}
            onChangeText={setNewHouseholdName}
            style={styles.input}
          />
        ) : (
          <Text style={styles.statisticsTextHouseHold}>
            {currentHouseholdName || 'Hushåll'}
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleSave();
            }
            setIsEditing(!isEditing);
          }}
        >
          <MaterialIcons
            name={isEditing ? 'save' : 'edit'}
            size={30}
            color="#777"
          />
        </TouchableOpacity>
      </View>
    );
  };

  const HouseholdCode = () => (
    <Card style={styles.codeCard}>
      <Card.Content>
        <Text variant="titleLarge">
          {currentHousehold!.code || 'Ingen kod'}
        </Text>
      </Card.Content>
    </Card>
  );

  const CurrentUserAvatar = () => (
    <View style={styles.avatarContainer}>
      <Avatar.Image size={60} source={avatarsMap[currentMember!.avatar].icon} />
      <View style={styles.usernameContainer}>
        <Text style={styles.username}>
          {currentMember!.name || 'användarnamn'}
        </Text>
        <TouchableOpacity
          onPress={() => console.log('Ändra avatar eller namn')}
        >
          <MaterialIcons name="edit" size={30} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const AllHouseholdMembers = () => {
    const handleMakeOwner = (member: HouseholdMember) => {
      if (!member) {
        console.error('No member to update!');
        return;
      }
      const updateMember = {
        id: member.id,
        userId: member.userId,
        householdId: member.householdId,
        avatar: member.avatar,
        name: member.name,
        owner: !member.owner,
        isActive: member.isActive,
        isRequest: member.isRequest,
      };
      dispatch(updateHouseholdMember(updateMember));
    };

    const handlePausePlayMember = (member: HouseholdMember) => {
      if (!member) {
        console.error('No member to update!');
        return;
      }
      const updateMember = {
        id: member.id,
        userId: member.userId,
        householdId: member.householdId,
        avatar: member.avatar,
        name: member.name,
        owner: member.owner,
        isActive: !member.isActive,
        isRequest: member.isRequest,
      };
      dispatch(updateHouseholdMember(updateMember));
    };

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Hushållsmedlemmar</Text>
          <View style={styles.membersContainer}>
            {membersInCurrentHousehold.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Avatar.Image
                  size={30}
                  source={avatarsMap[member.avatar].icon}
                  style={styles.avatar}
                />
                {isOwner && (
                  <View style={{ paddingRight: 3 }}>
                    <Pressable onPress={() => handleMakeOwner(member)}>
                      <MaterialIcons
                        name="face"
                        size={20}
                        color={member.owner ? 'green' : '#777'}
                      />
                    </Pressable>
                    <Pressable onPress={() => handlePausePlayMember(member)}>
                      <MaterialIcons
                        name={member.isActive ? 'pause' : 'play-arrow'}
                        size={20}
                        color={member.isActive ? '#FF7F50' : 'green'}
                      />
                    </Pressable>
                  </View>
                )}
                <Text style={styles.memberName}>
                  {member.name || 'Medlemsnamn'}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const RemoveHousehold = () => (
    <View style={styles.binIcon}>
      <TouchableOpacity onPress={() => console.log('Ta bort hushåll')}>
        <MaterialIcons name="delete" size={30} color="#777" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CurrentHousehold />
      <HouseholdCode />
      <CurrentUserAvatar />
      <AllHouseholdMembers />
      <RemoveHousehold />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    maxHeight: 1000,
  },
  householdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statisticsTextHouseHold: {
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    width: 200,
    marginRight: 10,
    fontSize: 18,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  card: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    flexShrink: 1,
    flexGrow: 0,
  },
  membersContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memberItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    marginRight: 8,
  },
  codeCard: {
    width: 300,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  binIcon: {
    padding: 20,
    marginBottom: 50,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  memberName: {
    maxWidth: 100,
    padding: 2,
    fontSize: 16,
    flexWrap: 'wrap',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
