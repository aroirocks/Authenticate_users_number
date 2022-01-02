import React, {useState, useRef} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {sendOtp, verifyOtp} from '../services/service';

const singupValidationSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  number: yup
    .number()
    .typeError('you must specify a number')
    .required('Number is required'),
});

const ProfilePage = ({route}) => {
  const formRef = useRef();

  // Get user from params
  const {user} = route.params;

  const [Fields, setFields] = useState({
    isNumberVerified: false,
    otpsent: false,
  });

  const VerifyPhoneNumber = async () => {
    if (formRef.current.isValid) {
      if (formRef.current.values.number) {
        try {
          const sendOTP = await sendOtp(`91${formRef.current.values.number}`);
          if (sendOTP) {
            setFields({...Fields, otpsent: true});
          }
        } catch (error) {
          if (error) {
            console.log(error);
          }
        }
      }
    }
  };

  async function confirmCode() {
    if (formRef.current.isValid) {
      if (formRef.current.values.number) {
        try {
          const res = await verifyOtp(
            `91${formRef.current.values.number}`,
            formRef.current.values.otp,
          );
          if (res.data.status === 'approved') {
            save();
          }
        } catch (error) {
          console.log('Invalid code.');
        }
      }
    }
  }

  async function save() {
    if (formRef.current.isValid) {
      // Add to firestore o redirect the user to loginPage
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: user
            ? user.photoURL
            : 'https://bootdey.com/img/Content/avatar/avatar6.png',
        }}
      />
      <View style={styles.form}>
        <Formik
          validationSchema={singupValidationSchema}
          enableReinitialize={true}
          innerRef={formRef}
          initialValues={{
            name: user ? user.displayName : '',
            email: user ? user.email : '',
            number: user ? user.number : '',
          }}
          onSubmit={values => console.log(values)}>
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                style={styles.input}
                placeholder="Name"
              />
              {errors.name ? (
                <Text style={{fontSize: 10, color: 'red'}}>{errors.name}</Text>
              ) : null}
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                editable={false}
                placeholder="Email"
              />
              {errors.email ? (
                <Text style={{fontSize: 10, color: 'red'}}>{errors.email}</Text>
              ) : null}
              <TextInput
                onChangeText={handleChange('number')}
                onBlur={handleBlur('number')}
                value={values.number}
                style={styles.input}
                keyboardType="numeric"
                placeholder="Number"
              />
              {errors.number ? (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.number}
                </Text>
              ) : null}

              {values.number && Fields.otpsent == false ? (
                <TouchableOpacity
                  style={styles.verify}
                  onPress={VerifyPhoneNumber}>
                  <Text style={styles.verify_txt}>Verify</Text>
                </TouchableOpacity>
              ) : null}

              {Fields.otpsent === true ? (
                <TextInput
                  onChangeText={handleChange('otp')}
                  onBlur={handleBlur('otp')}
                  value={values.otp}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Otp"
                />
              ) : null}
              {errors.otp ? (
                <Text style={{fontSize: 10, color: 'red'}}>{errors.otp}</Text>
              ) : null}
              <TouchableOpacity style={styles.save} onPress={confirmCode}>
                <Text style={styles.savetxt}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 5,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 50,
  },
  container: {
    flex: 1,
    padding: 30,
  },
  input: {
    height: 40,
    margin: 15,
    borderWidth: 0,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  verify: {
    backgroundColor: '#B5BD89',
    alignSelf: 'flex-end',
    marginRight: 15,
    width: 110,
    height: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  verify_txt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  save: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    width: 80,
    backgroundColor: '#B5BD89',
  },
  savetxt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 150,
  },
});
