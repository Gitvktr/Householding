import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { addCurrentUserToFirestore } from '../store/user/userThunks';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { FirebaseError } from 'firebase/app';
import { RootStackParamList } from '../navigators/RootStackNavigator';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleRegister = async () => {
    const validationResult = registerSchema.safeParse({ email, password });

    let newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      newErrors = {
        email: formattedErrors.email?._errors[0],
        password: formattedErrors.password?._errors[0],
      };
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        addCurrentUserToFirestore();
        setErrors({});
        navigation.navigate('Home');
      })
      .catch((error: FirebaseError) => {
        if (error.code === 'auth/email-already-in-use') {
          newErrors.email = 'Email already in use';
          setErrors(newErrors);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon.png')}
        style={{ width: 200, height: 200, alignSelf: 'center' }}
      />

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        theme={{ roundness: 10 }}
        error={!!errors.email}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        theme={{ roundness: 10 }}
        error={!!errors.password}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Cancel
        </Button>

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ACC1C2',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#999',
    borderRadius: 10,
    elevation: 5,
  },
  button: {
    backgroundColor: '#fff',
    width: '40%',
    borderRadius: 25,
    paddingVertical: 5,
    elevation: 5,
    marginTop: 20,
  },
  buttonLabel: {
    color: '#000',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
